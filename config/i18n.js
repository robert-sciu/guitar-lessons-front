import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import config from "./config";

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
          common: {
            nothingHere: "Nic tu jeszcze nie ma... 🏜️",
          },
          mainNav: {
            home: "Start",
            login: "Zaloguj się",
            register: "Zarejestruj się",
          },
          loginRegisterForm: {
            register: "Zarejestruj się",
            login: "Zaloguj się",
            username: "Imię (widoczne dla innych)",
            usernameError: `Wprowadź poprawnie nazwę użytkownika (min. ${config.minUsernameLength} znaków, max. ${config.maxUsernameLength} znaków, duże i małe litery oraz cyfry)`,
            email: "E-mail",
            emailError: "Wprowadź poprawny adres e-mail",
            password: "Hasło",
            passwordError: `Wprowadź poprawne hasło (min. ${config.minPasswordLength} znaków, max. ${config.maxPasswordLength} znaków)`,
            submitBtn: "Zaloguj",
            notMemberYet: "Nie masz jeszcze konta?",
            registrationSuccess: "Rejestracja przebiegła pomyslnie",
            goToLogin: "Przejdz do logowania",
            contactUs: "Skontaktuj się z nami",
            verificationSuccess: "Weryfikacja przebiegła pomyslnie",
            redirectToLogin: "Zostaniesz automatycznie przekierowany za",
            finishRegistration:
              "Sprawdź email i kliknij link, aby zakonczyc rejestracje",
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
            admin: "Panel Admina",
          },
          adminNav: {
            dashboard: "Panel standardowy",
            users: "Użytkownicy",
            tasks: "Zadania",
            tags: "Tagi",
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
            permanentReservationDate: "Termin stałej rezerwacji",
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
            tags: "Tagi",
            levelFilter: "Ukryj zadania poniżej poziomu",
            saving: "Zapisuję",
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
            isTyping: "Zapisuję...",
          },
          calendar: {
            myReservation: "Moja lekcja",
            bookIt: "Zarezerwuj",
            acceptReschedule: "Potwierdzasz nowe dane rezerwacji?",
            date: "Data",
            time: "Godzina",
            duration: "Długość",
            editFreely: "Edytuj bez ograniczeń do godziny:",
            confirmCancel: "Czy na pewno chcesz anulować rezerwację?",
            editing: "Edytuję...",
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
          months: {
            1: "Stycznia",
            2: "Lutego",
            3: "Marca",
            4: "Kwietnia",
            5: "Maja",
            6: "Czerwca",
            7: "Lipca",
            8: "Sierpnia",
            9: "Wrzesnia",
            10: "Pażdziernika",
            11: "Listopada",
            12: "Grudnia",
          },
          buttons: {
            edit: "Edytuj",
            change: "Zmień",
            save: "Zapisz",
            delete: "Usuń",
            logout: "wyloguj",
            confirm: "Potwierdź",
            cancel: "Anuluj",
            close: "Zamknij",
            download: "Pobierz",
            wait: "Czekaj",
            cancelReservation: "Odwołaj",
            nextWeek: "Następny",
            previousWeek: "Poprzedni",
            register: "Zarejestruj",
          },
          modals: {
            codeRequired: "Kod wymagany",
            codePlaceholder: "Kod",
            myLesson: "Moja lekcja",
            newReservation: "Nowa lekcja",
            date: "Data",
            time: "Godzina",
            duration: "Czas trwania",
            confirm: "Potwierdź",
            cancel: "Anuluj",
            minutes: "minut",
          },
          errors: {
            cannotBookEarlierThanTomorrow:
              "Nie możesz rezerwowac lekcji wcześniej niż jutro",
            cannotBookAfterEndDay:
              "Nie мożesz rezerwowac lekcji dalej niż za 14 dni",
            cannotBookOutsideWorkingHours:
              "Nie można rezerwowac lekcji poza godzinami pracy",
            invalidDuration: "Można rezerwowac lekcje od 1 do 2 godzin",
            thatsPast: "Było, minęło ;)",
            thatsToday: "Nie można zmieniać dzisiejszej rezerwacji",
            thatsNotMine: "To nie jest twoja lekcja :P",
          },
        },
      },
      en: {
        translation: {
          common: {
            nothingHere: "Nothing here... 🌵",
          },
          mainNav: {
            home: "Home",
            login: "Login",
            register: "Register",
          },
          loginRegisterForm: {
            register: "Register",
            login: "Login",
            username: "Nickname (visible to others)",
            usernameError: `Enter a valid username (min ${config.minUsernameLength} characters, max ${config.maxUsernameLength} characters, uppercase and lowercase letters and numbers)`,
            email: "Email",
            emailErro: "Enter a valid email",
            password: "Password",
            passwordError: `Enter a valid password (min ${config.minPasswordLength} characters, max ${config.maxPasswordLength} characters)`,
            submitBtn: "Login",
            notMemberYet: "Not a member yet?",
            registrationSuccess: "Registration completed successfully",
            goToLogin: "Go to login",
            contactUs: "Contact us",
            verificationSuccess: "Verification completed successfully",
            redirectToLogin: "You will be automatically redirected in",
            finishRegistration:
              "Check your email and click the link to finish registration",
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
            admin: "admin",
          },
          adminNav: {
            dashboard: "standard dashboard",
            users: "users",
            tasks: "tasks",
            tags: "tags",
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
            tags: "Tags",
            levelFilter: "Hide tasks below level",
            saving: "Saving",
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
          calendar: {
            myReservation: "My reservation",
            bookIt: "Book it",
            acceptReschedule: "Do you confirm the new date?",
            date: "Date",
            time: "Time",
            duration: "Duration",
            editFreely: "Edit reservation freely until:",
            confirmCancel: "Are you sure you want to cancel this reservation?",
            editing: "Editing...",
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
          months: {
            1: "January",
            2: "February",
            3: "March",
            4: "April",
            5: "May",
            6: "June",
            7: "July",
            8: "August",
            9: "September",
            10: "October",
            11: "November",
            12: "December",
          },
          buttons: {
            edit: "Edit",
            change: "Change",
            save: "Save",
            delete: "Delete",
            logout: "logout",
            cancel: "Cancel",
            confirm: "Confirm",
            close: "Close",
            download: "Download",
            wait: "Wait",
            cancelReservation: "Cancel reservation",
            register: "Register",
          },
          modals: {
            codeRequired: "Code required",
            codePlaceholder: "Code",
            myLesson: "My lesson",
            newReservation: "New reservation",
            date: "Date",
            time: "Time",
            duration: "Duration",
            cancel: "Cancel",
            confirm: "Confirm",
            minutes: "minutes",
          },
          errors: {
            cannotBookEarlierThanTomorrow: "Cannot book earlier than tomorrow",
            cannotBookAfterEndDay: "Cannot book later than 14 days from today",
            cannotBookOutsideWorkingHours: "Cannot book outside working hours",
            invalidDuration: "You can book lessons from 1 to 2 hours",
            thatsPast: "You cannot change a past reservation",
            thatsToday: "You cannot change today's reservation",
            thatsNotMine: "This is not your lesson :P",
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
