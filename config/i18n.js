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
            dashboard: "Centrum Dowodzenia",
            level: "Twój poziom",
            profileStatus: "Status profilu",
            active: "aktywny",
            inactive: "nieaktywny",
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
          daysOfTheWeek: {
            0: "Niedziela",
            1: "Poniedziałek",
            2: "Wtorek",
            3: "Środa",
            4: "Czwartek",
            5: "Piatek",
            6: "Sobota",
            label: "godzina",
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

        dashboardNav: {
          welcome: "Welcome",
          home: "home",
          tasks: "my tasks",
          availableTasks: "available tasks",
          completedTasks: "completed tasks",
          calendar: "calendar",
          payments: "payments",
          logout: "logout",
          dashboard: "Dashboard",
          level: "Your level",
          profileStatus: "Profile status",
          active: "active",
          inactive: "inactive",
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
        daysOfTheWeek: {
          0: "Sunday",
          1: "Monday",
          2: "Tuesday",
          3: "Wednesday",
          4: "Thursday",
          5: "Friday",
          6: "Saturday",
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
