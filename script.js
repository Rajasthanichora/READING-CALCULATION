// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const elements = {
        previousReading: document.getElementById('previous-reading'),
        currentReading: document.getElementById('current-reading'),
        numpad1: document.getElementById('numpad-1'),
        numpad2: document.getElementById('numpad-2'),
        totalUnits: document.getElementById('total-units'),
        resultArea: document.getElementById('electricity-result'),
        numpads: document.querySelectorAll('.numpad'),
        buttons: document.querySelectorAll('.numpad-btn')
    };

    // Optimized numpad show/hide
    const showNumpad = (numpad) => {
        elements.numpads.forEach(n => n.classList.remove('active'));
        numpad.classList.add('active');
    };

    const hideAllNumpads = () => elements.numpads.forEach(n => n.classList.remove('active'));

    // Optimized input handlers with direct binding
    elements.previousReading.onclick = (e) => {
        e.preventDefault();
        showNumpad(elements.numpad1);
    };

    elements.currentReading.onclick = (e) => {
        e.preventDefault();
        showNumpad(elements.numpad2);
    };

    // Optimized click outside handler
    document.onclick = (e) => {
        if (!e.target.closest('.numpad') && !e.target.closest('input')) {
            hideAllNumpads();
        }
    };

    // Optimized numpad click handler
    const handleNumpadClick = (input, value) => {
        if (value === 'C') {
            input.value = '';
        } else {
            if (value === '.' && input.value.includes('.')) return;
            if (input.value.includes('.')) {
                const decimalPlaces = input.value.split('.')[1].length;
                if (decimalPlaces >= 2) return;
            }
            input.value += value;
        }
        calculateTotal();
    };

    // Optimized button click handlers with direct binding
    elements.buttons.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const numpad = btn.closest('.numpad');
            const input = numpad.id === 'numpad-1' ? elements.previousReading : elements.currentReading;
            handleNumpadClick(input, btn.textContent);
        };
    });

    // MVAR Calculation Logic
    const calculateTotal = () => {
        const mw = parseFloat(elements.previousReading.value) || 0;
        const mva = parseFloat(elements.currentReading.value) || 0;

        // Square both values
        const mwSquared = Math.pow(mw, 2);
        const mvaSquared = Math.pow(mva, 2);

        // Subtract MW squared from MVA squared
        const difference = mvaSquared - mwSquared;

        // Take square root of the difference
        const mvar = Math.sqrt(difference);

        // Display result with 3 decimal places
        elements.totalUnits.textContent = mvar.toFixed(3);

        // Update styling based on result
        elements.resultArea.style.borderColor = mvar > 0 ? 'rgba(0, 255, 255, 0.5)' : 'rgba(255, 0, 0, 0.3)';
        elements.totalUnits.style.color = mvar > 0 ? '#00ffff' : '#ff6b6b';
    };

    // Prevent default keyboard
    [elements.previousReading, elements.currentReading].forEach(input => {
        input.onfocus = (e) => {
            e.preventDefault();
            input.blur();
        };
    });

    // Initialize navigation
    initializeNavigation();
    showSection('electricity');
});

// Initialize all input fields with event listeners
function initializeInputs() {
    document.querySelectorAll('input[type="number"]').forEach(input => {
        // Add input event listener
        input.addEventListener('input', handleInput);

        // Add focus event listener for better UX
        input.addEventListener('focus', handleFocus);

        // Add blur event listener
        input.addEventListener('blur', handleBlur);
    });
}

// Initialize navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            link.classList.add('active');

            // Get the target section
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });

    // Handle hash changes (for direct links)
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const activeLink = document.querySelector(`.nav-link[href="#${hash}"]`);
            if (activeLink) {
                navLinks.forEach(l => l.classList.remove('active'));
                activeLink.classList.add('active');
                showSection(hash);
            }
        }
    });
}

// Show selected section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section-card').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
}

// Handle input changes
function handleInput(event) {
    const input = event.target;
    const resultId = input.id.replace('-input', '-result');
    const resultElement = document.getElementById(resultId);

    if (input.value) {
        // Format the number with commas for better readability
        const formattedValue = new Intl.NumberFormat('en-IN').format(input.value);
        resultElement.textContent = `Current reading: ${formattedValue}`;

        // Add success styling
        resultElement.style.color = '#2f855a';
    } else {
        resultElement.textContent = 'Results will appear here';
        resultElement.style.color = '#4a5568';
    }
}

// Handle focus event
function handleFocus(event) {
    const input = event.target;
    input.parentElement.classList.add('focused');
}

// Handle blur event
function handleBlur(event) {
    const input = event.target;
    input.parentElement.classList.remove('focused');
} 