function validateCard() {
  const name = document.getElementById('name').value.trim();
  const cardNumber = document.getElementById('cardNumber').value.replace(/\s+/g, '');
  const resultElement = document.getElementById('result');

  if (!name) {
    resultElement.textContent = "❗ Please enter your name.";
    resultElement.style.color = 'red';
    return;
  }

  if (!/^\d+$/.test(cardNumber)) {
    resultElement.textContent = `❗ ${name} : Please enter only digits in the card number.`;
    resultElement.style.color = 'red';
    return;
  }

  const isValid = luhnCheck(cardNumber);
  if (isValid) {
    resultElement.textContent = `✅ ${name} : your card having card number ( ${cardNumber} ) is valid.`;
    resultElement.style.color = 'green';
  } else {
    resultElement.textContent = `❌ ${name} : your card having card number ( ${cardNumber} ) is invalid.`;
    resultElement.style.color = 'red';
  }
}

function luhnCheck(number) {
  let sum = 0;
  let shouldDouble = false;

  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}