/* 
* FreshFruit Shop - Form Validation
* ฟังก์ชั่นตรวจสอบข้อมูลในฟอร์มต่างๆ
*/

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Get all forms that need validation
    const forms = document.querySelectorAll('.needs-validation');

    // Form validation rules
    const validationRules = {
        // Required field validation
        required: function(input) {
            if (input.type === 'checkbox') {
                return input.checked;
            } else if (input.type === 'radio') {
                const radioGroup = document.querySelectorAll(`input[name="${input.name}"]`);
                return Array.from(radioGroup).some(radio => radio.checked);
            } else {
                return input.value.trim() !== '';
            }
        },
        
        // Email validation
        email: function(input) {
            const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return pattern.test(input.value.trim());
        },
        
        // Phone number validation (Thai format)
        phone: function(input) {
            // Thai phone number formats: 0x-xxx-xxxx or 0xxxxxxxx
            const pattern = /^0[0-9]{8,9}$/;
            return pattern.test(input.value.replace(/[- ]/g, ''));
        },
        
        // Minimum length validation
        minLength: function(input, length) {
            return input.value.trim().length >= length;
        },
        
        // Maximum length validation
        maxLength: function(input, length) {
            return input.value.trim().length <= length;
        },
        
        // Number validation
        number: function(input) {
            return !isNaN(parseFloat(input.value)) && isFinite(input.value);
        },
        
        // Integer validation
        integer: function(input) {
            return /^-?\d+$/.test(input.value.trim());
        },
        
        // Minimum value validation
        min: function(input, min) {
            return parseFloat(input.value) >= min;
        },
        
        // Maximum value validation
        max: function(input, max) {
            return parseFloat(input.value) <= max;
        },
        
        // Pattern validation
        pattern: function(input, pattern) {
            const regExp = new RegExp(pattern);
            return regExp.test(input.value.trim());
        },
        
        // Match validation (e.g., confirm password)
        match: function(input, targetId) {
            const target = document.getElementById(targetId);
            return target && input.value === target.value;
        }
    };

    // Error messages for validation rules
    const errorMessages = {
        required: 'กรุณากรอกข้อมูลในช่องนี้',
        email: 'กรุณากรอกอีเมลให้ถูกต้อง',
        phone: 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (0x-xxx-xxxx)',
        minLength: (length) => `กรุณากรอกอย่างน้อย ${length} ตัวอักษร`,
        maxLength: (length) => `กรุณากรอกไม่เกิน ${length} ตัวอักษร`,
        number: 'กรุณากรอกตัวเลขเท่านั้น',
        integer: 'กรุณากรอกจำนวนเต็ม',
        min: (min) => `กรุณากรอกค่าไม่น้อยกว่า ${min}`,
        max: (max) => `กรุณากรอกค่าไม่เกิน ${max}`,
        pattern: 'กรุณากรอกข้อมูลให้ตรงตามรูปแบบที่กำหนด',
        match: (field) => `กรุณากรอกข้อมูลให้ตรงกับ ${field}`
    };

    // Validate single input
    function validateInput(input) {
        let isValid = true;
        let errorMessage = '';

        // Check all validation attributes
        for (const rule in validationRules) {
            // Skip if rule is not applied to this input
            if (!input.hasAttribute(`data-${rule}`) && !input.hasAttribute(rule)) {
                continue;
            }

            let ruleValue = input.getAttribute(`data-${rule}`) || input.getAttribute(rule) || true;
            let validationResult;

            // Handle rule-specific parameters
            switch (rule) {
                case 'minLength':
                case 'maxLength':
                case 'min':
                case 'max':
                case 'pattern':
                    validationResult = validationRules[rule](input, ruleValue);
                    if (!validationResult) {
                        isValid = false;
                        errorMessage = typeof errorMessages[rule] === 'function'
                            ? errorMessages[rule](ruleValue)
                            : errorMessages[rule];
                    }
                    break;
                case 'match':
                    validationResult = validationRules[rule](input, ruleValue);
                    if (!validationResult) {
                        isValid = false;
                        const targetLabel = document.querySelector(`label[for="${ruleValue}"]`);
                        const fieldName = targetLabel ? targetLabel.textContent : ruleValue;
                        errorMessage = typeof errorMessages[rule] === 'function'
                            ? errorMessages[rule](fieldName)
                            : errorMessages[rule];
                    }
                    break;
                default:
                    validationResult = validationRules[rule](input);
                    if (!validationResult) {
                        isValid = false;
                        errorMessage = errorMessages[rule];
                    }
                    break;
            }

            // Break on first validation error
            if (!isValid) {
                break;
            }
        }

        // Update UI based on validation result
        updateValidationUI(input, isValid, errorMessage);
        return isValid;
    }

    // Update the UI to show validation state
    function updateValidationUI(input, isValid, errorMessage = '') {
        const formGroup = input.closest('.form-group');
        
        if (!formGroup) return;

        // Remove any existing error message
        const existingError = formGroup.querySelector('.validation-error');
        if (existingError) {
            existingError.remove();
        }

        if (!isValid) {
            // Add error class to input
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');

            // Create and append error message
            const errorElement = document.createElement('div');
            errorElement.className = 'validation-error';
            errorElement.textContent = errorMessage;
            formGroup.appendChild(errorElement);
        } else {
            // Add valid class to input
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        }
    }

    // Validate entire form
    function validateForm(form) {
        let isFormValid = true;
        const inputs = form.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            // Skip inputs that don't need validation
            if (!input.hasAttribute('required') && 
                !input.hasAttribute('data-required') && 
                !Array.from(input.attributes).some(attr => attr.name.startsWith('data-'))) {
                return;
            }

            const isInputValid = validateInput(input);
            if (!isInputValid) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    // Set up validation for all forms
    if (forms.length) {
        forms.forEach(form => {
            // Validate inputs on blur
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    validateInput(this);
                });

                // Remove error state when user starts typing
                input.addEventListener('input', function() {
                    this.classList.remove('is-invalid');
                    this.classList.remove('is-valid');

                    // Remove error message
                    const formGroup = this.closest('.form-group');
                    if (formGroup) {
                        const error = formGroup.querySelector('.validation-error');
                        if (error) {
                            error.remove();
                        }
                    }
                });
            });

            // Validate form on submit
            form.addEventListener('submit', function(event) {
                const isValid = validateForm(this);

                if (!isValid) {
                    event.preventDefault();
                    event.stopPropagation();

                    // Scroll to the first invalid input
                    const firstInvalidInput = form.querySelector('.is-invalid');
                    if (firstInvalidInput) {
                        firstInvalidInput.focus();
                        firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }

                form.classList.add('was-validated');
            });
        });
    }

    // Contact Form Special Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Format phone number input
        const phoneInput = contactForm.querySelector('input[type="tel"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                // Remove any non-digit characters
                let value = this.value.replace(/\D/g, '');
                
                // Format as 0x-xxx-xxxx
                if (value.length > 3 && value.length <= 6) {
                    value = value.slice(0, 3) + '-' + value.slice(3);
                } else if (value.length > 6) {
                    value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
                }
                
                this.value = value;
            });
        }

        // Handle file upload preview
        const fileInput = contactForm.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.addEventListener('change', function() {
                const filePreview = document.getElementById('file-preview');
                if (!filePreview) return;

                filePreview.innerHTML = '';

                if (this.files && this.files.length > 0) {
                    for (let i = 0; i < this.files.length; i++) {
                        const file = this.files[i];
                        const fileItem = document.createElement('div');
                        fileItem.className = 'file-item';
                        
                        // Create file icon and name
                        const fileIcon = document.createElement('i');
                        fileIcon.className = 'fas fa-file';
                        fileItem.appendChild(fileIcon);
                        
                        const fileName = document.createElement('span');
                        fileName.textContent = file.name;
                        fileItem.appendChild(fileName);
                        
                        // Add file size
                        const fileSize = document.createElement('small');
                        const size = file.size / 1024 < 1024 
                            ? (file.size / 1024).toFixed(1) + ' KB' 
                            : (file.size / (1024 * 1024)).toFixed(1) + ' MB';
                        fileSize.textContent = size;
                        fileItem.appendChild(fileSize);
                        
                        filePreview.appendChild(fileItem);
                    }
                }
            });
        }
    }

    // Newsletter form validation
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (emailInput && emailInput.value.trim() !== '' && validationRules.email(emailInput)) {
                // Success state
                emailInput.classList.remove('is-invalid');
                
                // Here would normally be the AJAX call to subscribe
                // For demo, we'll show a success message
                const formContainer = this.closest('.newsletter-container');
                if (formContainer) {
                    this.style.display = 'none';
                    
                    const successMsg = document.createElement('div');
                    successMsg.className = 'newsletter-success';
                    successMsg.innerHTML = '<i class="fas fa-check-circle"></i> ขอบคุณสำหรับการสมัครรับข่าวสาร!';
                    formContainer.appendChild(successMsg);
                }
            } else {
                // Error state
                emailInput.classList.add('is-invalid');
                
                // Show error message
                const formGroup = emailInput.closest('.form-group');
                if (formGroup) {
                    const existingError = formGroup.querySelector('.validation-error');
                    if (existingError) {
                        existingError.remove();
                    }
                    
                    const errorElement = document.createElement('div');
                    errorElement.className = 'validation-error';
                    errorElement.textContent = 'กรุณากรอกอีเมลให้ถูกต้อง';
                    formGroup.appendChild(errorElement);
                }
            }
        });
    }
});