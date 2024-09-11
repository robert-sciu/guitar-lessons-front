import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
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
            availableTasks: "dostępne zadania",
            completedTasks: "zakończone zadania",
            calendar: "kalendarz",
            payments: "płatności",
            logout: "wyloguj",
          },
          taskDisplay: {
            title: "Tytuł",
            artist: "Wykonawca",
            description: "Opis",
            difficultyLevel: "Poziom trudnosci",
            showMore: "Zobacz więcej",
            addTask: "Dodaj zadanie",
            deleteTask: "Usuń zadanie",
            userNotes: "Notatki",
          },
        },
      },
      eng: {
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
        translation: {
          dashboardNav: {
            welcome: "Welcome",
            home: "home",
            tasks: "my tasks",
            availableTasks: "available tasks",
            completedTasks: "completed tasks",
            calendar: "calendar",
            payments: "payments",
            logout: "logout",
          },
        },
        taskDisplay: {
          title: "Title",
          artist: "Artist",
          description: "Description",
          difficultyLevel: "Difficulty level",
          showMore: "Show more",
          addTask: "Add task",
          deleteTask: "Delete task",
          userNotes: "User notes",
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
  });

export default i18n;
