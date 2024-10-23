import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    interpolation: {
      escapeValue: false, // Disables escaping of characters
    },
    resources: {
      pl: {
        translation: {
          mainNav: {
            home: "Start",
            login: "Zaloguj się",
          },
          loginForm: {
            login: "Zaloguj się",
            username: "Nazwa użytkownika",
            email: "E-mail",
            emailError: "Wprowadź poprawny adres e-mail",
            password: "Hasło",
            passwordError: "Wprowadź poprawne hasło",
            submitBtn: "Zaloguj",
          },
          dashboardNav: {
            welcome: "Witaj",
            home: "start",
            tasks: "moje zadania",
            availableTasks: "dostępne zadania",
            completedTasks: "wykonane zadania",
            calendar: "kalendarz",
            payments: "płatności",
            dashboard: "Centrum Dowodzenia",
          },
          userInfo: {
            basicInfo: "Podstawowe Informacje",
            username: "Imię",
            email: "E-mail",
            level: "Poziom doświadczenia",
            profileStatus: "Status profilu",
            active: "aktywny",
            inactive: "nieaktywny",
          },
          planInfo: {
            basicInfo: "Ustawienia Planu",
            hasPermanentReservation: "Stały termin",
            permanentReservationDate: "Termin lekcji",
            lessonDuration: "Długość lekcji",
            reschedulesLeftCount: "Dostępne zmiany terminu",
            cancelledLessonsCount: "Anulowane lekcje",
            discount: "Rabat",
            active: "aktywny",
            inactive: "nieaktywny",
          },
          myTasks: {
            title: "Moje Zadania",
          },
          availableTasks: {
            title: "Wszystkie Zadania",
            selectedTags: "Zaznaczone Tagi",
          },
          completedTasks: {
            title: "Wykonane Zadania",
          },
          taskDisplay: {
            title: "Tytuł",
            artist: "Wykonawca",
            description: "Opis",
            difficultyLevel: "Poziom trudności",
            showMore: "Zobacz więcej",
            showLess: "Zobacz mniej",
            addTask: "Dodaj zadanie",
            addingTask: "Dodaję...",
            deleteTask: "Usuń zadanie",
            deletingTask: "Usuwam...",
            confirmDelete: "Czy na pewno chcesz usunąć to zadanie?",
            userNotes: "Notatki",
            tutorial: "Tutorial",
            note: "Notka",
            file: "Plik",
            isTyping: "zapisuję...",
          },
          daysOfTheWeek: {
            0: "Niedziela",
            1: "Poniedziałek",
            2: "Wtorek",
            3: "Środa",
            4: "Czwartek",
            5: "Piątek",
            6: "Sobota",
            label: "godzina",
          },
          buttons: {
            edit: "Edytuj",
            save: "Zapisz",
            delete: "Usuń",
            logout: "wyloguj",
            confirm: "Potwierdź",
            cancel: "Anuluj",
            close: "Zamknij",
            download: "Pobierz",
          },
          modals: {
            codeRequired: "Kod wymagany",
            codePlaceholder: "Kod",
          },
        },
      },
      en: {
        translation: {
          mainNav: {
            home: "Home",
            login: "Login",
          },
          loginForm: {
            login: "Login",
            username: "Username",
            email: "Email",
            emailErro: "Enter a valid email",
            password: "Password",
            passwordError: "Enter a valid password",
            submitBtn: "Login",
          },

          dashboardNav: {
            welcome: "Welcome",
            home: "home",
            tasks: "my tasks",
            availableTasks: "available tasks",
            completedTasks: "completed tasks",
            calendar: "calendar",
            payments: "payments",

            dashboard: "Dashboard",
            level: "Your level",
            profileStatus: "Profile status",
            active: "active",
            inactive: "inactive",
          },

          userInfo: {
            basicInfo: "Basic info",
            username: "Username",
            email: "Email",
            level: "Your level",
            profileStatus: "Profile status",
            active: "active",
            inactive: "inactive",
          },
          planInfo: {
            basicInfo: "Plan settings",
            hasPermanentReservation: "Permanent reservation",
            permanentReservationDate: "Lesson date",
            lessonDuration: "Lesson duration",
            reschedulesLeftCount: "Reschedules left",
            cancelledLessonsCount: "Cancelled lessons",
            discount: "Discount",
            active: "active",
            inactive: "inactive",
          },
          myTasks: {
            title: "My tasks",
          },
          availableTasks: {
            title: "Available tasks",
            selectedTags: "Selected tags",
          },
          completedTasks: {
            title: "Completed tasks",
          },
          taskDisplay: {
            title: "Title",
            artist: "Artist",
            description: "Description",
            difficultyLevel: "Difficulty level",
            showMore: "Show more",
            showLess: "Show less",
            addTask: "Add task",
            addingTask: "Adding...",
            deleteTask: "Delete task",
            deletingTask: "Deleting...",
            confirmDelete: "Are you sure you want to delete this task?",
            userNotes: "User notes",
            tutorial: "Tutorial",
            note: "Note",
            file: "File",
            isTyping: "is typing...",
          },
          daysOfTheWeek: {
            0: "Sunday",
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday",
          },
          buttons: {
            edit: "Edit",
            save: "Save",
            delete: "Delete",
            logout: "logout",
            cancel: "Cancel",
            confirm: "Confirm",
            close: "Close",
            download: "Download",
          },
          modals: {
            codeRequired: "Code required",
            codePlaceholder: "Code",
          },
        },
      },
      fallbackLng: "pl",
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
      },
    },
  });

export default i18n;
