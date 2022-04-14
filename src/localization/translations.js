import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            api: {
                "informations-updated": "Informations has been updated!",
                "informations-loading": "Updating informations...",
                "update-error": "Error while updating!",

                "restaurant-closed": "At the given time the restaurant is closed!",
                "appointments-missing-parameters": "Parameters are missing!",
                "appointment-updated": "Appointment updated!",
                "appointment-not-found": "Appointment not found!",
                "bad-appointment-pin": "Appointment PIN doesn't match!",
                "appointment-deleted": "Appointment removed successfully!",
                "book-for-past": "You can't book for the past!",
                "book-for-future": "You can't book over 60 days!",
                "too-many-people": "Too many people for selected table!",
                
                "remove-live-table": "You can't remove a table which is in use!",
                "remove-booked-table": "You can't remove a table which has appointments for the future!",
                "bad-layout-tables": "Tables are not on inside of the box!",
                "layout-updated": "Layout properties updated!",
                "layout-tables-updated": "Layout tables updated!",
                "layout-not-found": "Layout not found!",
                
                "category-added": "New category added!",
                "category-not-found": "Category not found!",
                "category-updated": "Category updated!",
                "food-not-found": "Searched food not found!",
                "food-modified": "Searched food modified!",
                "food-name-exists": "This food name already exists!",
                "food-added": "New food added!",
                "category-deleted": "Category deleted!",
                "food-deleted": "Food deleted!",
                "menu-not-found": "Menu not found!",
                
                "table-booked-live": "Table booked for live use!",
                "table-have-orders": "Table has orders!",
                "table-updated": "Table updated!",
                "food-menu-not-found": "Given food is not on menu!",
                "order-added": "Order added!",
                "order-removed": "Order removed!",
                "order-increased": "Order quantity increased!",
                "order-decreased": "Order quantity decreased!",
                "no-orders": "No orders are selected!",
                "bad-orders": "Item is not on the list!",
                "invalid-orders": "Item's quantity is not matching!",
                "table-not-found": "Table not found!",
                "table-use-incorrect": "Table's live use property is incorrect!",

                "badly-formatted-data": "User data doesn't match requirements!",
                "user-email-conflict": "This email already exists!",
                "user-created": "Account created!",
                "restaurant-not-found": "Restaurant not found!",
                "restaurant-bad-pin": "Bad PIN code for invite!",
                "no-invitation": "This email doesn't have any invitation!",
                "user-invited": "User invited!",
                "wrong-password": "Wrong password!",
                "login-user-not-found": "This email doesn't exist!",
                "refresh-token-failed-refresh": "Failed to refresh auth token!",
                "user-not-found": "Given user not found!",
                "user-rank-permission-denied": "You have no permission to change that rank!",
                "user-role-update": "User's role has been updated!",
                "user-delete-yourself": "You can't delete yourself!",
                "user-removed": "User has been removed!"
            }
        }
    },
    hu: {
        translation: {
            api: {
                "informations-updated": "Adatok sikeresen frissítve!",
                "informations-loading": "Adatok frissítése...",
                "update-error": "Hiba a frissítés közben!",
                
                "restaurant-closed": "A megadott időpontban az étterem zárva tart!",
                "appointments-missing-parameters": "Nincs elég adat a kéréshez!",
                "appointment-updated": "Foglalás frissítve!",
                "appointment-not-found": "A keresett foglalás nem található!",
                "bad-appointment-pin": "A foglalás PIN kódja nem egyezik!",
                "appointment-deleted": "Foglalás törölve!",
                "book-for-past": "Nem foglalhatsz múltbéli időpontot!",
                "book-for-future": "Nem foglalhatsz 60 napon túl!",
                "too-many-people": "Nincs elég férőhely a kiválasztott asztalnál!",
                
                "remove-live-table": "Nem távolíthatsz el olyan asztalt, ami használatban van!",
                "remove-booked-table": "Nem törölhetsz olyan asztalt, melyhez vannak foglalások!",
                "bad-layout-tables": "Az asztalok nincsenek megfelelő helyen!",
                "layout-updated": "Elrendezés adati frissítve!",
                "layout-tables-updated": "Asztalok frissítve!",
                "layout-not-found": "A keresett elrendezés nem található!",

                "category-added": "Új kategória hozzáadva!",
                "category-not-found": "A kategória nem található!",
                "category-updated": "Kategória frissítve!",
                "food-not-found": "A keresett menüelem nem található!",
                "food-modified": "Menüelem módosítva!",
                "food-name-exists": "Ezzel a névvel már létezik menüelem!",
                "food-added": "Új menüelem hozzáadva!",
                "category-deleted": "Kategória törölve!",
                "food-deleted": "Menüelem törölve!",
                "menu-not-found": "A keresett menü nem található!",

                "table-booked-live": "Asztal lefoglalva!",
                "table-have-orders": "A kiválasztott asztalhoz tartozik rendelés!",
                "table-updated": "Asztal frissítve!",
                "food-menu-not-found": "A megadott étel nincs az étlapon!",
                "order-added": "Rendelés hozzáadva!",
                "order-removed": "Rendelés törölve!",
                "order-increased": "Rendelés mennyisége növelve!",
                "order-decreased": "Rendelés mennyisége csökkentve!",
                "no-orders": "Nincs rendelés az asztalnál!",
                "bad-orders": "A kiválasztott elem nem szerepel a menüben!",
                "invalid-orders": "Nem megfelelő a rendelések mennyisége!",
                "table-not-found": "A kiválasztott asztal nem található!",
                "table-use-incorrect": "Az asztal használati mezője nem megfelelő!",

                "badly-formatted-data": "Az adatok formátuma nem megfelelő!",
                "user-email-conflict": "A megadott emailhez tartozik fiók!",
                "user-created": "Fiók létrehozva!",
                "restaurant-not-found": "Étterem nem található!",
                "restaurant-bad-pin": "Rossz PIN a csatlakozáshoz!",
                "no-invitation": "A megadott email nincs meghívva!",
                "user-invited": "Sikeres meghívás!",
                "wrong-password": "Helytelen jelszó!",
                "login-user-not-found": "A megadott emailhez nem tartozik fiók!",
                "refresh-token-failed-refresh": "Hiba a token frissítése közben!",
                "user-not-found": "A megadott felhasználó nem található!",
                "user-rank-permission-denied": "Nincs engedélyed a módosításra!",
                "user-role-update": "Felhasználó joga frissítve!",
                "user-delete-yourself": "Nem törölheted a saját fiókodat!",
                "user-removed": "Fiók törölve!"
            }
        }
    }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources, 
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;