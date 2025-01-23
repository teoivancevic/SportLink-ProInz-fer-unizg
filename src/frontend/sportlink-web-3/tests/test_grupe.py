import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import undetected_chromedriver as uc
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.alert import Alert


@pytest.fixture()
def driver():
   options = webdriver.ChromeOptions()
   options.add_argument("--headless")
   driver = webdriver.Chrome(options=options)
   driver.implicitly_wait(5)
   yield driver
   driver.quit()

def test_termini(driver):
   driver.get("http://localhost:3000")

   email = "cowomot157@halbov.com"
   password = "Zaporka1!"

   while driver.execute_script("return document.readyState") != "complete":
      time.sleep(0.5)

   WebDriverWait(driver, 15).until(
      EC.visibility_of_element_located((By.XPATH, "//button[text()='Prijava']"))
   )
   gumb_prijava = driver.find_element(By.XPATH, "//button[text()='Prijava']")
   gumb_prijava.click()

   while driver.execute_script("return document.readyState") != "complete":
      time.sleep(0.5)

   WebDriverWait(driver, 15).until(
      EC.visibility_of_element_located((By.ID, 'email'))
   )

   email_field = driver.find_element(By.ID, 'email')
   password_field = driver.find_element(By.ID, 'password')
   login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")

   email_field.send_keys(email)
   password_field.send_keys(password)
   login_button.click()

   WebDriverWait(driver, 15).until(
      EC.visibility_of_element_located((By.XPATH, "//button[@aria-expanded='false']")))
   
   WebDriverWait(driver, 15).until(EC.visibility_of_element_located((By.XPATH, "//a[@href='/organization/7']"))).click()
   WebDriverWait(driver, 15).until(EC.visibility_of_element_located((By.XPATH, "//a[@href='/organization/7/training-groups']"))).click()
   gumb_dodaj = WebDriverWait(driver, 15).until(EC.visibility_of_element_located((By.XPATH, "//button[text()=' Dodaj grupu za trening']")))

   #WebDriverWait(driver, 15).until(EC.visibility_of_element_located((By.XPATH, "//div[@class='rounded-xl border bg-card text-card-foreground shadow flex flex-col max-h-[400px] overflow-y-auto']")))
   #koliko_termina_prije = driver.find_elements(By.XPATH, "//div[@class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow']/div")
   gumb_dodaj.click()

   form = WebDriverWait(driver, 20).until(EC.visibility_of_all_elements_located((By.XPATH, "//form[@class='space-y-4']/div")))
   
   WebDriverWait(form[0], 15).until(EC.element_to_be_clickable((By.XPATH, "./input"))).send_keys("Grupacija")

   WebDriverWait(form[1], 15).until(EC.element_to_be_clickable((By.XPATH, "./button"))).click()
   WebDriverWait(driver, 5).until(EC.visibility_of_element_located((By.XPATH, "//div[text()='Hokej na travi']"))).click()

   dobne_granice = form[2].find_elements(By.XPATH, "./div")
   WebDriverWait(dobne_granice[0], 15).until(EC.element_to_be_clickable((By.XPATH, "./input"))).send_keys(Keys.BACK_SPACE)
   dobne_granice[0].find_element(By.XPATH, "./input").send_keys("17")
   dobne_granice[1].find_element(By.XPATH, "./input").send_keys(Keys.BACK_SPACE)
   dobne_granice[1].find_element(By.XPATH, "./input").send_keys("34")

   WebDriverWait(form[4], 15).until(EC.element_to_be_clickable((By.XPATH, "./input"))).send_keys(Keys.BACK_SPACE)
   form[4].find_element(By.XPATH, "./input").send_keys("234")

   WebDriverWait(form[5], 15).until(EC.element_to_be_clickable((By.XPATH, "./textarea"))).send_keys("Blablablablabla. Bla?")

   driver.find_element(By.XPATH, "//button[text()='Dodaj termin']").click()
   driver.find_element(By.XPATH, "//button[text()='Dodaj termin']").click()
   kante = WebDriverWait(driver, 15).until(EC.visibility_of_any_elements_located((By.XPATH, "//button/*[local-name()='svg']")))
   kante[-1].find_element(By.XPATH, "..").click()   

   termini = driver.find_elements(By.XPATH, "//div[@class='flex gap-2 mt-2 items-center']")
   assert len(termini) == 1

   vremena = driver.find_elements(By.XPATH, "//div[@class='flex gap-2 mt-2 items-center']/input")
   vremena[0].send_keys("1111")
   vremena[1].send_keys("1234")

   driver.find_element(By.XPATH, "//button[text()='Submit']").click() 
   time.sleep(1)

   uredi = WebDriverWait(driver, 15).until(EC.visibility_of_all_elements_located((By.XPATH, "//button[text()='Uredi']")))[-1]
   WebDriverWait(driver, 15).until(EC.element_to_be_clickable(uredi)).click()

   uredjivanje = WebDriverWait(driver, 15).until(EC.element_to_be_clickable(
      (By.XPATH, "//label[text()='Ime grupe']/following-sibling::input[1]")))
   time.sleep(1)
   
   uredjivanje.send_keys(Keys.CONTROL + "a")
   uredjivanje.send_keys(Keys.BACK_SPACE)
   uredjivanje.send_keys("Promjena")

   driver.find_element(By.XPATH, "//button[text()='Submit']").click()

   WebDriverWait(driver, 15).until(EC.visibility_of_element_located(
      (By.XPATH, "//div[text()='Promjena']")))
   kanta = WebDriverWait(driver, 15).until(EC.visibility_of_all_elements_located((By.XPATH, "//button[text()='Izbriši']")))[-1]

   WebDriverWait(driver, 15).until(EC.element_to_be_clickable(kanta)).click()
   WebDriverWait(driver, 15).until(EC.alert_is_present())
   alert = Alert(driver)
   alert.accept()
   time.sleep(1)
   driver.refresh()
   WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//div[text()='Nema dostupnih grupa za trening unutar ove organizacije.']")))
   #koliko_termina_poslije = driver.find_elements(By.XPATH, "//div[@class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow']/div")
   #print(len(koliko_termina_prije), len(koliko_termina_poslije))
   #assert len(koliko_termina_prije) == len(koliko_termina_poslije)
   