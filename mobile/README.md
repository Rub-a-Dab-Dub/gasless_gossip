# Project Name

A Flutter project built using **Stacked Architecture** with the help of the [Stacked CLI](https://stacked.filledstacks.com/).  

---

## 🚀 Getting Started  

### 1. Prerequisites  
Make sure you have the following installed:  
- [Flutter SDK](https://docs.flutter.dev/get-started/install) (latest **stable** channel recommended)  
- [Dart SDK](https://dart.dev/get-dart)  
- [Stacked CLI](https://stacked.filledstacks.com/)  
- An IDE such as **Android Studio**, **VS Code**, or **IntelliJ IDEA**  

Verify installations:  
```bash
flutter --version
dart --version
stacked --version
2. Clone the Repository
bash
Copy code
git clone https://github.com/your-username/your-repo.git
cd your-repo
3. Install Dependencies
Fetch the Flutter and Dart packages:

bash
Copy code
flutter pub get
4. Run the App
Start the application on your connected device/emulator:

bash
Copy code
flutter run
For hot reload: press r in the terminal.
For full restart: press R in the terminal.

📂 Project Structure (Stacked)
This project follows the Stacked Architecture convention:

bash
Copy code
lib/
 ├── app/            # App setup (router, dependency injection)
 ├── ui/             # Views (screens) + ViewModels
 ├── services/       # Business logic (API, DB, etc.)
 ├── models/         # Data models
 ├── widgets/        # Reusable UI components
 └── utils/          # Helpers, constants
🛠️ Useful Stacked CLI Commands
The Stacked CLI helps generate boilerplate quickly.

Create a New View (with ViewModel & route):
bash
Copy code
stacked create view home
Create a Service:
bash
Copy code
stacked create service api
Create a Model:
bash
Copy code
stacked create model user
Generate All Missing Files (after manual edits):
bash
Copy code
stacked generate
Create a Dialog:
bash
Copy code
stacked create dialog confirmation
Create a Bottom Sheet:
bash
Copy code
stacked create bottomsheet info