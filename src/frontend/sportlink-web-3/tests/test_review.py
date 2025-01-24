import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import random
import string
import undetected_chromedriver as uc
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.keys import Keys

@pytest.fixture()
def driver():
   options = webdriver.ChromeOptions()
   options.add_argument("--headless")
   driver = webdriver.Chrome(options=options)
   driver.implicitly_wait(5)
   yield driver
   driver.quit()

def test_ostavljanje_recenzije(driver):
   driver.get("http://localhost:3000")

   email = "dixew58334@kurbieh.com"
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

   driver.get("http://localhost:3000/organization/2")

   WebDriverWait(driver, 10).until(
      EC.visibility_of_element_located((By.XPATH, "//div[text()='Recenzije']"))).click()
   
   while driver.execute_script("return document.readyState") != "complete":
      time.sleep(0.5)

   tekst_recenzije = "Jako dobro, svaka pohvala, necu doci ponovno."
   text_area = WebDriverWait(driver, 10).until(
      EC.visibility_of_element_located((By.XPATH, "//textarea[@placeholder='Napišite svoju recenziju ovdje...']")))
   text_area.send_keys(tekst_recenzije)

   WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//p[text()='Vaša ocjena:']/following-sibling::*[local-name()='svg']"))).click()
   gumb_posalji = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[text()='Pošalji Recenziju']")))
   gumb_posalji.click()

   tekst_rec = WebDriverWait(driver, 5).until(EC.visibility_of_element_located((By.XPATH, f"//blockquote[contains(., '{tekst_recenzije}')]")))

   WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//button[text()='Izbriši']"))).click()
   time.sleep(5)
   driver.implicitly_wait(0)
   try:
      WebDriverWait(driver, 5).until(EC.visibility_of_element_located((By.XPATH, f"//blockquote[contains(., '{tekst_recenzije}')]")))
      assert False
   except TimeoutException:
      assert True

def test_odgovor_na_recenziju(driver):
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
   
   WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//a[@href='/organization/7/reviews']"))).click()
   while driver.execute_script("return document.readyState") != "complete":
      time.sleep(0.5)
    
   stari_tekst = WebDriverWait(driver, 5).until(EC.visibility_of_element_located((By.XPATH, "//p[text()='Odgovor organizacije:']/following-sibling::p[1]"))).text
   WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//button[text()='Odgovori']"))).click()
   tekst = ''.join(random.choices(string.ascii_lowercase, k=20))
   textarea = WebDriverWait(driver, 3).until(
      EC.visibility_of_element_located(
         (By.XPATH, "//textarea[@placeholder='Napišite odgovor na recenziju...']")))
   textarea.send_keys(Keys.CONTROL + 'a')
   textarea.send_keys(Keys.BACKSPACE)
   textarea.send_keys(tekst)
   WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//button[text()='Pošalji']"))).click()
   WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//button[text()='Odgovori']")))
   time.sleep(5)
   novi_tekst = WebDriverWait(driver, 5).until(EC.visibility_of_element_located((By.XPATH, "//p[text()='Odgovor organizacije:']/following-sibling::p[1]"))).text
   assert (novi_tekst != stari_tekst)