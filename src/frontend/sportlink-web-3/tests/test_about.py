import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import undetected_chromedriver as uc
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException


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

   WebDriverWait(driver, 10).until(
      EC.visibility_of_element_located((By.XPATH, "//button[text()='Prijava']"))
   )
   gumb_prijava = driver.find_element(By.XPATH, "//button[text()='Prijava']")
   gumb_prijava.click()

   while driver.execute_script("return document.readyState") != "complete":
      time.sleep(0.5)

   WebDriverWait(driver, 10).until(
      EC.visibility_of_element_located((By.ID, 'email'))
   )

   email_field = driver.find_element(By.ID, 'email')
   password_field = driver.find_element(By.ID, 'password')
   login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")

   email_field.send_keys(email)
   password_field.send_keys(password)
   login_button.click()

   WebDriverWait(driver, 10).until(
      EC.visibility_of_element_located((By.XPATH, "//button[@aria-expanded='false']")))
   
   WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//a[@href='/organization/7']"))).click()

   WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//button[text()='Uredi']"))).click()

   form = driver.find_elements(By.XPATH, "//form[@class='space-y-4']/div")

   ime = form[0].find_element(By.XPATH, "./input")
   ime.send_keys(Keys.CONTROL + "a")
   ime.send_keys(Keys.BACK_SPACE)
   ime.send_keys("Novo Ime")

   opis = form[1].find_element(By.XPATH, "./textarea")
   opis.send_keys(Keys.CONTROL + "a")
   opis.send_keys(Keys.BACK_SPACE)
   opis.send_keys("Novi opis")

   mail = form[2].find_element(By.XPATH, "./input")
   mail.send_keys(Keys.CONTROL + "a")
   mail.send_keys(Keys.BACK_SPACE)
   mail.send_keys("dixew58334")

   telefon = form[3].find_element(By.XPATH, "./div/input")
   telefon.send_keys(Keys.CONTROL + "a")
   telefon.send_keys(Keys.BACK_SPACE)
   telefon.send_keys("2342342344523")

   lokacija = form[4].find_element(By.XPATH, "./div/input")
   lokacija.send_keys(Keys.CONTROL + "a")
   lokacija.send_keys(Keys.BACK_SPACE)
   lokacija.send_keys("Ulica Matije Divkovića 19A Zagreb, Hrvatska" + Keys.ENTER)

   WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//button[text()='Spremi promjene']"))).click()

   time.sleep(1)
   try:
      driver.find_element((By.XPATH, "//h2[text()='Uredi profil organizacije']"))
      assert False
   except Exception:
      assert True

   mail = form[2].find_element(By.XPATH, "./input")
   mail.send_keys(Keys.CONTROL + "a")
   mail.send_keys(Keys.BACK_SPACE)
   mail.send_keys("dixew58334@kurbieh.com")

   WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//button[text()='Spremi promjene']"))).click()

   WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//p[text()='Novi opis']")))




