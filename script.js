document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const photoInput = document.getElementById('photo');
    const photoPreview = document.getElementById('photoPreview');
    const ipAddressInput = document.getElementById('ipAddress');
    const invitationForm = document.getElementById('invitationForm');
    const successMessage = document.getElementById('successMessage');
    const uploadLabelSpan = document.querySelector('.upload-label span');

    // Fetch IP Address using ipify API
    async function fetchIP() {
        try {
            ipAddressInput.value = 'Detecting...';
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            ipAddressInput.value = data.ip;
        } catch (error) {
            console.error('Error fetching IP:', error);
            ipAddressInput.value = 'Unable to detect (Retry later)';
        }
    }

    // Call fetch IP immediately
    fetchIP();

    // Handle Photo Preview
    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please upload a valid image file within format like JPG, PNG.');
                photoInput.value = '';
                return;
            }

            const reader = new FileReader();
            
            reader.onload = function(event) {
                photoPreview.style.backgroundImage = `url(${event.target.result})`;
                photoPreview.classList.remove('hidden');
                uploadLabelSpan.textContent = 'Change Photo';
            };
            
            reader.readAsDataURL(file);
        } else {
            photoPreview.style.backgroundImage = 'none';
            photoPreview.classList.add('hidden');
            uploadLabelSpan.textContent = 'Upload Your Photo';
        }
    });

    // Handle Form Submission
    invitationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get values for demonstration
        const formData = new FormData(invitationForm);
        const name = formData.get('fullName');
        const mobile = formData.get('mobile');
        const ip = ipAddressInput.value;

        // Basic validation
        if (!name || !mobile || !photoInput.files[0]) {
            alert('Please complete all required fields including your photo.');
            return;
        }

        // Simulate API call and success behavior
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = `
            <span>Processing...</span>
            <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
        `;
        submitBtn.disabled = true;

        // Add a spinning animation explicitly since we injected SVG
        const style = document.createElement('style');
        style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);

        setTimeout(() => {
            // Hide Form, Show Success Message
            invitationForm.style.display = 'none';
            document.querySelector('.header p').style.display = 'none';
            document.querySelector('h1').textContent = 'Thank You, ' + name.split(' ')[0] + '!';
            
            successMessage.classList.remove('hidden');
            
            // Console log the captured data 
            console.log('--- RSVP COMPLETED ---');
            console.log('Name:', name);
            console.log('Mobile:', mobile);
            console.log('IP Address:', ip);
            console.log('Photo uploaded:', photoInput.files[0].name);
        }, 1500);
    });
});
