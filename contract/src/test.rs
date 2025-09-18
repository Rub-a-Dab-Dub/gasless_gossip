#![cfg(test)]

use crate::users::users::{UserManager, UserManagerClient};

use super::*;
use soroban_sdk::{vec, Env, String};

#[test]
fn test() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(UserManager, {});
    let client = UserManagerClient::new(&env, &contract_id);

}
