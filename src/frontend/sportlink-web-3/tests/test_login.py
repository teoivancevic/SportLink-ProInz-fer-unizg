import pytest
import time

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import undetected_chromedriver as uc

@pytest.fixture()
def driver():
    options = uc.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = uc.Chrome(version_main=131, options=options)
    driver.implicitly_wait(5)
    yield driver
    driver.quit()


def test_tocanLogin(driver):
    driver.get("http://localhost:3000/")
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

    # WebDriverWait(driver, 10).until(
    #     lambda d: d.current_url == "http://localhost:3000/"
    # )


def test_netocanMail(driver):
    driver.get("http://localhost:3000/")
    email = "dfsdf@halbov.com"
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

    WebDriverWait(driver, 2).until(
        EC.visibility_of_element_located((By.XPATH, "//p[text()='Invalid login credentials']"))
    )


def test_netocanPassword(driver):
    driver.get("http://localhost:3000/")
    email = "cowomot157@halbov.com"
    password = "fsldjfl"

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

    WebDriverWait(driver, 2).until(
        EC.visibility_of_element_located((By.XPATH, "//p[text()='Invalid login credentials']"))
    )

