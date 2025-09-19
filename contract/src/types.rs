use soroban_sdk::{contracttype, Address, String};

/// Level thresholds defining XP required for each level (10 levels)
/// Level 1: 0-99 XP (implicit, starts at 0)
/// Level 2: 100-299 XP
/// Level 3: 300-599 XP
/// Level 4: 600-999 XP
/// Level 5: 1000-1499 XP
/// Level 6: 1500-2199 XP
/// Level 7: 2200-2999 XP
/// Level 8: 3000-3999 XP
/// Level 9: 4000-5199 XP
/// Level 10: 5200-6599 XP (and beyond)
pub const LEVEL_THRESHOLDS: [u64; 10] = [100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5200, 6600];

/// Calculate the level based on XP amount
/// Returns a level between 1 and 10 (inclusive)
pub fn calculate_level(xp: u64) -> u32 {
    // Special case for Level 1 (0-99 XP)
    if xp < LEVEL_THRESHOLDS[0] {
        return 1;
    }
    
    // Special case for Level 10 (5200+ XP)
    if xp >= LEVEL_THRESHOLDS[9] {
        return 10;
    }
    
    // Calculate cumulative thresholds for each level
    let mut prev_threshold = 0;
    for (index, &threshold) in LEVEL_THRESHOLDS.iter().enumerate() {
        if xp >= prev_threshold && xp < threshold {
            return (index + 1) as u32;
        }
        prev_threshold = threshold;
    }
    
    10 // Should never reach here due to earlier checks, but rust needs this
}


#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct  UserProfile {
    pub account_id: Address,
    pub username: String,
    pub xp: u64,
    pub level: u32,
    pub reputation: i64, 
    pub created_at: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    UserProfile(Address),
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calculate_level_edge_cases() {
        // Test Level 1 edge cases
        assert_eq!(calculate_level(0), 1, "0 XP should be Level 1");
        assert_eq!(calculate_level(99), 1, "99 XP should be Level 1");
        
        // Test exact threshold values
        assert_eq!(calculate_level(100), 2, "100 XP should be Level 2");
        assert_eq!(calculate_level(300), 3, "300 XP should be Level 3");
        assert_eq!(calculate_level(600), 4, "600 XP should be Level 4");
        assert_eq!(calculate_level(1000), 5, "1000 XP should be Level 5");
        assert_eq!(calculate_level(1500), 6, "1500 XP should be Level 6");
        assert_eq!(calculate_level(2200), 7, "2200 XP should be Level 7");
        assert_eq!(calculate_level(3000), 8, "3000 XP should be Level 8");
        assert_eq!(calculate_level(4000), 9, "4000 XP should be Level 9");
        assert_eq!(calculate_level(5200), 10, "5200 XP should be Level 10");
        
        // Test mid-range values
        assert_eq!(calculate_level(150), 2, "150 XP should be Level 2");
        assert_eq!(calculate_level(550), 3, "550 XP should be Level 3");
        assert_eq!(calculate_level(2500), 7, "2500 XP should be Level 7");
        
        // Test max level cap
        assert_eq!(calculate_level(6600), 10, "6600 XP should be Level 10");
        assert_eq!(calculate_level(9999), 10, "9999 XP should be Level 10");
    }
}
