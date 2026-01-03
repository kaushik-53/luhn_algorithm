// Format card number with spaces as user types
document.getElementById('cardNumber').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\s+/g, '');
  
  // Format with spaces every 4 digits
  let formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
  
  // Update input value
  e.target.value = formatted;
  
  // Update card preview
  document.getElementById('cardNumberPreview').textContent = formatted || '#### #### #### ####';
  
  // Auto-trim to max length (19 chars = 16 digits + 3 spaces)
  if (formatted.length > 19) {
    e.target.value = formatted.substring(0, 19);
    document.getElementById('cardNumberPreview').textContent = formatted.substring(0, 19);
  }
});

// Update cardholder name preview
document.getElementById('name').addEventListener('input', function(e) {
  const name = e.target.value.toUpperCase();
  document.getElementById('namePreview').textContent = name || 'CARDHOLDER NAME';
});

function validateCard() {
  const name = document.getElementById('name').value.trim();
  const cardNumber = document.getElementById('cardNumber').value.replace(/\s+/g, '');
  const resultContainer = document.getElementById('resultContainer');
  const resultIcon = document.getElementById('resultIcon');
  const resultTitle = document.getElementById('resultTitle');
  const resultElement = document.getElementById('result');
  const validateBtn = document.getElementById('validateBtn');

  // Reset states
  resultContainer.className = 'result-container';
  
  // Add loading state to button
  validateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Validating...';
  validateBtn.disabled = true;

  // Simulate network delay for better UX
  setTimeout(() => {
    // Check name
    if (!name) {
      resultContainer.classList.add('warning');
      resultIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
      resultTitle.textContent = "Missing Information";
      resultElement.textContent = "Please enter your cardholder name.";
      resultElement.style.color = '#f39c12';
      
      // Reset button
      validateBtn.innerHTML = '<i class="fas fa-shield-check"></i> Validate Card';
      validateBtn.disabled = false;
      return;
    }

    // Check card number
    if (!cardNumber) {
      resultContainer.classList.add('warning');
      resultIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
      resultTitle.textContent = "Missing Information";
      resultElement.textContent = "Please enter your card number.";
      resultElement.style.color = '#f39c12';
      
      // Reset button
      validateBtn.innerHTML = '<i class="fas fa-shield-check"></i> Validate Card';
      validateBtn.disabled = false;
      return;
    }

    // Check if only digits
    if (!/^\d+$/.test(cardNumber)) {
      resultContainer.classList.add('invalid');
      resultIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
      resultTitle.textContent = "Invalid Input";
      resultElement.textContent = `Please enter only digits in the card number.`;
      resultElement.style.color = '#c0392b';
      
      // Reset button
      validateBtn.innerHTML = '<i class="fas fa-shield-check"></i> Validate Card';
      validateBtn.disabled = false;
      return;
    }

    // Check card length
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      resultContainer.classList.add('invalid');
      resultIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
      resultTitle.textContent = "Invalid Length";
      resultElement.textContent = `Card number must be between 13-19 digits. You entered ${cardNumber.length} digits.`;
      resultElement.style.color = '#c0392b';
      
      // Reset button
      validateBtn.innerHTML = '<i class="fas fa-shield-check"></i> Validate Card';
      validateBtn.disabled = false;
      return;
    }

    // Perform Luhn validation
    const isValid = luhnCheck(cardNumber);
    const formattedCardNumber = cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    if (isValid) {
      resultContainer.classList.add('valid');
      resultIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
      resultTitle.textContent = "Valid Card!";
      resultElement.innerHTML = `<strong>${name}</strong>: Your card ending in <strong>${cardNumber.slice(-4)}</strong> passed the Luhn algorithm validation.`;
      resultElement.style.color = '#27ae60';
      
      // Add celebration effect
      setTimeout(() => {
        resultContainer.style.transform = 'scale(1.02)';
        setTimeout(() => {
          resultContainer.style.transform = 'scale(1)';
        }, 300);
      }, 100);
    } else {
      resultContainer.classList.add('invalid');
      resultIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
      resultTitle.textContent = "Invalid Card";
      resultElement.innerHTML = `<strong>${name}</strong>: The card number <strong>${formattedCardNumber}</strong> failed the Luhn algorithm check.`;
      resultElement.style.color = '#c0392b';
    }

    // Reset button
    validateBtn.innerHTML = '<i class="fas fa-shield-check"></i> Validate Card';
    validateBtn.disabled = false;
  }, 800); // Simulated delay
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

// Add Enter key support
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    validateCard();
  }
});
