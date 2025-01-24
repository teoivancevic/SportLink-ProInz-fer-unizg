import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import undetected_chromedriver as uc
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys


@pytest.fixture()
def driver():
   options = webdriver.ChromeOptions()
   options.add_argument("--headless")
   driver = webdriver.Chrome(options=options)
   driver.implicitly_wait(5)
   yield driver
   driver.quit()

def test_tocanLogin(driver):
   driver.get("https://webapp-sportlink-test-nextjs-03.azurewebsites.net/")

   while driver.execute_script("return document.readyState") != "complete":
      time.sleep(0.5)
      
   WebDriverWait(driver, 10).until(
      EC.visibility_of_element_located((By.XPATH, "//button[text()='Prijava']")))
   
   gumb_prijava = driver.find_element(By.XPATH, "//button[text()='Prijava']")
   gumb_prijava.click()
   
   while driver.execute_script("return document.readyState") != "complete":
      time.sleep(0.5)

   WebDriverWait(driver, 10).until(
      EC.visibility_of_element_located((By.ID, 'email')))
   
   email_field = driver.find_element(By.ID, 'email')
   password_field = driver.find_element(By.ID, 'password')
   login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")

   emails = ["cowomot157@fd.com", "cowomot157@halbov.com", "cowomot157@halbov.com"]
   passwords = ["Zaporka1!", "dsfadsf", "Zaporka1!"] 
   for i in range(3):
      email_field.send_keys(emails[i])
      password_field.send_keys(passwords[i])
      login_button.click()
      if i != 2:
         WebDriverWait(driver, 2).until(EC.visibility_of_element_located((By.XPATH, "//p[text()='Invalid login credentials']")))
         email_field.send_keys(Keys.CONTROL + "a")
         email_field.send_keys(Keys.BACKSPACE)
         password_field.send_keys(Keys.CONTROL + "a")
         password_field.send_keys(Keys.BACKSPACE)

   WebDriverWait(driver, 10).until(
      EC.visibility_of_element_located((By.XPATH, "//button[@aria-expanded='false']")))
