import pytest
import requests
import hashlib
import os
from random import randint
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import undetected_chromedriver as uc
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import TimeoutException

api_key = os.getenv("TEMPMAIL_RAPIDAPI_KEY")

@pytest.fixture()
def driver():
   options = webdriver.ChromeOptions()
   options.add_argument("--headless")
   driver = webdriver.Chrome(options=options)
   driver.implicitly_wait(5)
   yield driver
   driver.quit()


def test_tocnaPrijava(driver):
   driver.get("http://localhost:3000/")

   while driver.execute_script("return document.readyState") != "complete":
      time.sleep(0.5)
      
   WebDriverWait(driver, 10).until(
      EC.visibility_of_element_located((By.XPATH, "//button[text()='Registracija']")))
   
   gumb_prijava = driver.find_element(By.XPATH, "//button[text()='Registracija']")
   gumb_prijava.click()
   
   while driver.execute_script("return document.readyState") != "complete":
      time.sleep(0.5)

   WebDriverWait(driver, 10).until(
      EC.visibility_of_element_located((By.ID, 'firstName')))

   url = "https://privatix-temp-mail-v1.p.rapidapi.com/request/domains/"
   headers = {
    'x-rapidapi-host': 'privatix-temp-mail-v1.p.rapidapi.com',
    'x-rapidapi-key': api_key
   }
   domain_response = requests.get(url, headers=headers)
   if domain_response.status_code == 200:
      domains = domain_response.json()
      email = "temp" + str(randint(1, 100000)) + domains[4]
      password = "Zaporka1!"
   else:
      print(f"Failed to fetch data. Status code: {domain_response.response.status_code}, Response: {domain_response.response.text}")

   name_field = driver.find_element(By.ID, 'firstName')
   surname_field = driver.find_element(By.ID, 'lastName')
   email_field = driver.find_element(By.ID, 'email')
   password_field = driver.find_element(By.ID, 'password')
   login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")

   name_field.send_keys("Marko")
   surname_field.send_keys("Tomson")
   email_field.send_keys(email)
   password_field.send_keys(password)
   login_button.click()

   while driver.execute_script("return document.readyState") != "complete":
      time.sleep(0.5)

   # driver.get("http://localhost:3000/signup/otp?id=36")
   # while driver.execute_script("return document.readyState") != "complete":
   #    time.sleep(0.5)

   WebDriverWait(driver, 10).until(
      EC.visibility_of_element_located((By.XPATH, "//div[@class='p-6 pt-0 space-y-6']/div/input")))
   verifikacijski_brojevi = driver.find_elements(By.XPATH, "//div[@class='p-6 pt-0 space-y-6']/div/input")
   time.sleep(5)

   hash_mail = hashlib.md5(email.encode()).hexdigest()
   url = f"https://privatix-temp-mail-v1.p.rapidapi.com/request/mail/id/{hash_mail}/"
   headers = {
	"x-rapidapi-key": api_key,
	"x-rapidapi-host": "privatix-temp-mail-v1.p.rapidapi.com"
   }
   mailovi_response = requests.get(url, headers=headers)
   if mailovi_response.status_code == 200:
      mailovi = mailovi_response.json()
   else:
      print(f"Failed to fetch messages: {mailovi_response.status_code}, {mailovi_response.text}")

   # url = f"https://privatix-temp-mail-v1.p.rapidapi.com/request/one_mail/id/%7B{mail_id}%7D/"
   # headers = {
   #    'x-rapidapi-host': 'privatix-temp-mail-v1.p.rapidapi.com',
   #    'x-rapidapi-key': api_key
   # }
   # mail_response = requests.get(url, headers=headers)
   # if (mail_response.status_code == 200):
   #    mail_text = mail_response.json()
   #    mail_text = mail_text["mail_text"]
   #    verfication_key = ""
   for i in range(6):
      verifikacijski_brojevi[i].send_keys(mailovi[0]["mail_text"][-8+i])
   # else:
   #    print(f"Failed to fetch data. Status code: {mail_response.status_code}, Response: {mail_response.text}")
      
   gumb_verifikacija = driver.find_element(By.XPATH, "//button[text()='Verify']")
   gumb_verifikacija.click()


   WebDriverWait(driver, 20).until( 
      lambda driver: driver.current_url == "http://localhost:3000/login")
   WebDriverWait(driver, 10).until(
      EC.visibility_of_element_located((By.ID, 'email')))

   email_field = driver.find_element(By.ID, 'email')
   password_field = driver.find_element(By.ID, 'password')
   login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")

   email_field.send_keys(email)
   password_field.send_keys(password)
   login_button.click()

   WebDriverWait(driver, 10).until( 
      lambda driver: driver.current_url == "http://localhost:3000/")
   WebDriverWait(driver, 10).until(
      EC.visibility_of_element_located((By.XPATH, "//button[@aria-expanded='false']")))