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

def test_search(driver):
   # pretrazivanje grupa
   driver.get("http://localhost:3000")
   
   while driver.execute_script("return document.readyState") != "complete":
      time.sleep(0.5)

   WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//a[@href='/search?tab=groups']"))).click()

   WebDriverWait(driver, 10).until(EC.visibility_of_element_located(
      (By.XPATH, "//input[@placeholder='Pretraži po imenu...']"))).send_keys("Grupa")
      
   driver.find_element(By.XPATH, "//span[text()='Maksimalna cijena (Euro)']").click()
   driver.find_element(By.XPATH, "//input[@placeholder='Najskuplja cijena']").send_keys("999")
   
   driver.find_element(By.XPATH, "//span[text()='Raspon godina']").click()
   driver.find_element(By.XPATH, "//input[@placeholder='Min']").send_keys("15")
   driver.find_element(By.XPATH, "//input[@placeholder='Max']").send_keys("50")

   driver.find_element(By.XPATH, "//button[text()='Mješovito']").click()
   
   driver.find_element(By.XPATH, "//button[@role='combobox']").click()
   driver.find_element(By.XPATH, "//*[normalize-space()='Hrvanje']").click()
   
   driver.find_element(By.XPATH, "//button[text()='Traži']").click()

   WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//div[@class='p-4']"))).click()

   WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//h1[text()='Grupe za trening']")))

   assert driver.current_url == "http://localhost:3000/organization/7/training-groups"


   # pretrazivanje natjecanja
   driver.get("http://localhost:3000")

   while driver.execute_script("return document.readyState") != "complete":
      time.sleep(0.5)

   WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//a[@href='/search?tab=competitions']"))).click()

   WebDriverWait(driver, 10).until(EC.visibility_of_element_located(
      (By.XPATH, "//input[@placeholder='Pretraži po imenu...']"))).send_keys("Natjecanje")
   
   driver.find_element(By.XPATH, "//span[text()='Maksimalna cijena (Euro)']").click()
   driver.find_element(By.XPATH, "//input[@placeholder='Najskuplja cijena']").send_keys("1")

   driver.find_element(By.XPATH, "//span[text()='Raspon datuma']").click()
   driver.find_element(By.XPATH, "//label[text()='Početak natjecanja']/following-sibling::input[1]").send_keys("29012025")
   driver.find_element(By.XPATH, "//label[text()='Kraj natjecanja']/following-sibling::input[1]").send_keys("01022025")

   driver.find_element(By.XPATH, "//button[@role='combobox']").click()
   driver.find_element(By.XPATH, "//*[normalize-space()='Nogomet']").click()

   driver.find_element(By.XPATH, "//button[text()='Traži']").click()

   WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//div[@class='p-4']"))).click()

   WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//h1[text()='Natjecanja']")))

   assert driver.current_url == "http://localhost:3000/organization/2/tournaments"


   # pretrazivanje termina
   driver.get("http://localhost:3000")

   while driver.execute_script("return document.readyState") != "complete":
      time.sleep(0.5)

   WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//a[@href='/search?tab=bookings']"))).click()

   WebDriverWait(driver, 10).until(EC.visibility_of_element_located(
      (By.XPATH, "//input[@placeholder='Pretraži po imenu...']"))).send_keys("Mali nogomet")
   
   driver.find_element(By.XPATH, "//span[text()='Maksimalna cijena (Euro)']").click()
   driver.find_element(By.XPATH, "//input[@placeholder='Najskuplja cijena']").send_keys("25")

   driver.find_element(By.XPATH, "//button[@role='combobox']").click()
   driver.find_element(By.XPATH, "//*[normalize-space()='Tenis']").click()

   driver.find_element(By.XPATH, "//button[text()='Traži']").click()

   WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//p[text()='Ne postoje termini za uneseno pretraživanje. Pokušajte ponovo s drugim filterima.']")))

   search = driver.find_element(By.XPATH, "//input[@placeholder='Pretraži po imenu...']")
   search.send_keys(Keys.CONTROL + 'a')
   search.send_keys(Keys.BACKSPACE)
   search.send_keys("Teniski teren")

   driver.find_element(By.XPATH, "//button[text()='Traži']").click()

   WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//div[@class='p-4']"))).click()

   WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//h1[text()='Sportski Objekti i Tereni']")))

   assert driver.current_url == "http://localhost:3000/organization/7/sport-courts"
