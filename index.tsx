document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');

    // Sub-page navigation
    const homePage = document.getElementById('home-page');
    
    const gotoDischargeBtn = document.getElementById('goto-discharge-btn');
    const backBtnFromDischarge = document.querySelector('#discharge-page .back-btn');
    const dischargePage = document.getElementById('discharge-page');
    
    const gotoRestorationBtn = document.getElementById('goto-restoration-btn');
    const backBtnFromRestoration = document.querySelector('#restoration-page .back-btn');
    const restorationPage = document.getElementById('restoration-page');

    const gotoUploadCardsBtn = document.getElementById('goto-upload-cards-btn');
    const backBtnFromUploadCards = document.querySelector('#upload-cards-page .back-btn');
    const uploadCardsPage = document.getElementById('upload-cards-page');

    if (gotoDischargeBtn) {
        gotoDischargeBtn.addEventListener('click', () => {
            homePage.classList.remove('active');
            dischargePage.classList.add('active');
            document.querySelector('.nav-btn.active')?.classList.remove('active');
            populateEditForm();
        });
    }

    if (backBtnFromDischarge) {
        backBtnFromDischarge.addEventListener('click', () => {
            dischargePage.classList.remove('active');
            homePage.classList.add('active');
            document.querySelector('.nav-btn[data-target="home-page"]')?.classList.add('active');
        });
    }

    if (gotoRestorationBtn) {
        gotoRestorationBtn.addEventListener('click', () => {
            homePage.classList.remove('active');
            restorationPage.classList.add('active');
            document.querySelector('.nav-btn.active')?.classList.remove('active');
        });
    }

    if (backBtnFromRestoration) {
        backBtnFromRestoration.addEventListener('click', () => {
            restorationPage.classList.remove('active');
            homePage.classList.add('active');
            document.querySelector('.nav-btn[data-target="home-page"]')?.classList.add('active');
        });
    }
    
    if (gotoUploadCardsBtn) {
        gotoUploadCardsBtn.addEventListener('click', () => {
            homePage.classList.remove('active');
            uploadCardsPage.classList.add('active');
            document.querySelector('.nav-btn.active')?.classList.remove('active');
        });
    }

    if (backBtnFromUploadCards) {
        backBtnFromUploadCards.addEventListener('click', () => {
            uploadCardsPage.classList.remove('active');
            homePage.classList.add('active');
            document.querySelector('.nav-btn[data-target="home-page"]')?.classList.add('active');
        });
    }

    // Bottom navigation logic
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetPageId = button.getAttribute('data-target');

            pages.forEach(page => page.classList.remove('active'));
            navButtons.forEach(btn => btn.classList.remove('active'));

            const targetPage = document.getElementById(targetPageId);
            if (targetPage) {
                targetPage.classList.add('active');
            }
            button.classList.add('active');
        });
    });

    // ID card swipe-to-flip logic
    const cardInner = document.querySelector('.flippable-card-inner') as HTMLElement;
    if (cardInner) {
        let isDragging = false;
        let startX = 0;
        let currentAngle = 0;
        let dragStartAngle = 0;
        let liveAngle = 0;

        const getPageX = (e: MouseEvent | TouchEvent): number => {
            if ('touches' in e) {
                // Use changedTouches for touchend event
                return e.touches[0] ? e.touches[0].pageX : e.changedTouches[0].pageX;
            }
            return e.pageX;
        };

        const onDragStart = (e: MouseEvent | TouchEvent) => {
            isDragging = true;
            startX = getPageX(e);
            dragStartAngle = currentAngle;
            cardInner.style.transition = 'none';
            cardInner.style.cursor = 'grabbing';
        };

        const onDragging = (e: MouseEvent | TouchEvent) => {
            if (!isDragging) return;
            e.preventDefault(); // Prevents page scrolling on touch devices
            
            const currentX = getPageX(e);
            const diffX = currentX - startX;
            const rotationDelta = (diffX / cardInner.offsetWidth) * 180;
            
            liveAngle = dragStartAngle + rotationDelta;
            cardInner.style.transform = `rotateY(${liveAngle}deg)`;
        };

        const onDragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            cardInner.style.cursor = 'pointer';

            cardInner.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            
            const finalAngle = Math.round(liveAngle / 180) * 180;
            
            currentAngle = finalAngle;
            cardInner.style.transform = `rotateY(${finalAngle}deg)`;

            const isFlipped = (currentAngle / 180) % 2 !== 0;
            if (isFlipped) {
                cardInner.classList.add('is-flipped');
            } else {
                cardInner.classList.remove('is-flipped');
            }
        };

        cardInner.addEventListener('dragstart', (e) => e.preventDefault());

        // Mouse events
        cardInner.addEventListener('mousedown', onDragStart);
        window.addEventListener('mousemove', onDragging);
        window.addEventListener('mouseup', onDragEnd);

        // Touch events
        cardInner.addEventListener('touchstart', onDragStart, { passive: false });
        window.addEventListener('touchmove', onDragging, { passive: false });
        window.addEventListener('touchend', onDragEnd);
        window.addEventListener('touchcancel', onDragEnd);
    }

    // Language switcher logic
    const langToggleButton = document.querySelector('.profile-action-card');
    const langDisplay = document.querySelector('.lang-btn');
    const mobileFrame = document.querySelector('.mobile-frame');
    let currentLang: 'en' | 'ar' = 'en';

    const translations = {
      en: {
        'nav-home': 'Home',
        'nav-cards': 'Cards',
        'nav-profile': 'Profile',
        'header-title-home': 'Student Portal',
        'service-discharge': 'Discharge',
        'service-timetable': 'Timetable',
        'service-group': 'Group and Section',
        'service-exams-schedule': 'Exams Schedule',
        'service-exam-grades': 'Exam Grades',
        'service-assessment': 'Assessment',
        'service-percentage': 'Percentage (%)',
        'service-transcripts': 'Academic transcripts',
        'service-debts': 'Debts',
        'service-upload-cards': 'Upload Card Images',
        'service-enrollments': 'Enrollments',
        'service-restoration': 'Restoration',
        'service-other': 'Other services',
        'header-title-cards': 'ID Cards',
        'header-title-profile': 'My Profile',
        'label-pob': 'Place of Birth',
        'label-dob': 'Date of Birth',
        'action-change-lang': 'Change Language',
        'logout-btn': 'LOGOUT',
        'header-title-discharge': 'Edit Profile',
        'label-firstname': 'First Name',
        'label-lastname': 'Last Name',
        'label-university': 'University',
        'label-pob-form': 'Place of Birth',
        'label-dob-form': 'Date of Birth',
        'save-changes-btn': 'Save Changes',
        'header-title-restoration': 'Change Picture',
        'upload-prompt-text': 'Select a new photo for your profile and ID cards.',
        'upload-avatar-btn': 'Upload New Photo',
        'header-title-upload-cards': 'Upload Card Images',
        'upload-student-card-prompt': 'Student Card (Front)',
        'upload-residence-card-prompt': 'Residence Card (Back)',
      },
      ar: {
        'nav-home': 'الرئيسية',
        'nav-cards': 'البطاقات',
        'nav-profile': 'الملف الشخصي',
        'header-title-home': 'بوابة الطالب',
        'service-discharge': 'براءة الذمة',
        'service-timetable': 'جدول التوقيت',
        'service-group': 'الفوج والفرع',
        'service-exams-schedule': 'جدول الامتحانات',
        'service-exam-grades': 'نقاط الإمتحان',
        'service-assessment': 'التقييم',
        'service-percentage': 'النسبة المئوية (%)',
        'service-transcripts': 'كشوف النقاط',
        'service-debts': 'الديون',
        'service-upload-cards': 'تحميل صور البطاقات',
        'service-enrollments': 'التسجيلات',
        'service-restoration': 'الإطعام',
        'service-other': 'خدمات أخرى',
        'header-title-cards': 'بطاقات التعريف',
        'header-title-profile': 'ملفي الشخصي',
        'label-pob': 'مكان الميلاد',
        'label-dob': 'تاريخ الميلاد',
        'action-change-lang': 'تغيير اللغة',
        'logout-btn': 'تسجيل الخروج',
        'header-title-discharge': 'تعديل الملف الشخصي',
        'label-firstname': 'الإسم',
        'label-lastname': 'اللقب',
        'label-university': 'الجامعة',
        'label-pob-form': 'مكان الميلاد',
        'label-dob-form': 'تاريخ الميلاد',
        'save-changes-btn': 'حفظ التغييرات',
        'header-title-restoration': 'تغيير الصورة',
        'upload-prompt-text': 'اختر صورة جديدة لملفك الشخصي وبطاقات الهوية.',
        'upload-avatar-btn': 'تحميل صورة جديدة',
        'header-title-upload-cards': 'تحميل صور البطاقات',
        'upload-student-card-prompt': 'بطاقة الطالب (الأمام)',
        'upload-residence-card-prompt': 'بطاقة الإقامة (الخلف)',
      }
    };

    const setLanguage = (lang: 'en' | 'ar') => {
        currentLang = lang;
        if (lang === 'ar') {
            mobileFrame.classList.add('rtl');
            langDisplay.textContent = 'ar-DZ';
        } else {
            mobileFrame.classList.remove('rtl');
            langDisplay.textContent = 'en-DZ';
        }

        Object.keys(translations[lang]).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = translations[lang][key];
            }
        });
    };

    if (langToggleButton) {
        langToggleButton.addEventListener('click', () => {
            const newLang = currentLang === 'en' ? 'ar' : 'en';
            setLanguage(newLang);
        });
    }

    // User profile data management
    let currentUserData = {
        firstName: 'HACKER',
        lastName: 'MAMI',
        university: 'université de béjaia',
        pob: 'مجهول',
        dob: 'مجهول',
        avatarUrl: 'https://i.postimg.cc/X7wz6fQ6/mami-hacker.jpg'
    };

    const updateUserInfo = (user) => {
        const fullName = `${user.lastName} ${user.firstName}`;
        
        // Profile Page
        document.getElementById('profile-name').textContent = fullName;
        document.getElementById('profile-university').textContent = user.university;
        document.getElementById('profile-pob').textContent = user.pob;
        document.getElementById('profile-dob').textContent = user.dob;
        (document.getElementById('profile-avatar-lg') as HTMLImageElement).src = user.avatarUrl;

        // Header
        (document.getElementById('header-avatar-sm') as HTMLImageElement).src = user.avatarUrl;
    };

    // Edit profile form logic
    const editProfileForm = document.getElementById('edit-profile-form');

    const populateEditForm = () => {
        (document.getElementById('input-firstname') as HTMLInputElement).value = currentUserData.firstName;
        (document.getElementById('input-lastname') as HTMLInputElement).value = currentUserData.lastName;
        (document.getElementById('input-university') as HTMLInputElement).value = currentUserData.university;
        (document.getElementById('input-pob') as HTMLInputElement).value = currentUserData.pob;
        (document.getElementById('input-dob') as HTMLInputElement).value = currentUserData.dob;
    };
    
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            currentUserData = {
                ...currentUserData,
                firstName: (document.getElementById('input-firstname') as HTMLInputElement).value,
                lastName: (document.getElementById('input-lastname') as HTMLInputElement).value,
                university: (document.getElementById('input-university') as HTMLInputElement).value,
                pob: (document.getElementById('input-pob') as HTMLInputElement).value,
                dob: (document.getElementById('input-dob') as HTMLInputElement).value,
            };

            updateUserInfo(currentUserData);
            alert('Profile updated successfully!');
            // Go back to home page after saving
            backBtnFromDischarge.dispatchEvent(new Event('click'));
        });
    }

    // Avatar upload logic
    const uploadAvatarBtn = document.getElementById('upload-avatar-btn');
    const avatarUploadInput = document.getElementById('avatar-upload-input') as HTMLInputElement;

    if (uploadAvatarBtn && avatarUploadInput) {
        uploadAvatarBtn.addEventListener('click', () => {
            avatarUploadInput.click();
        });

        avatarUploadInput.addEventListener('change', (event) => {
            const target = event.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                const file = target.files[0];
                const reader = new FileReader();

                reader.onload = (e) => {
                    const newAvatarUrl = e.target.result as string;
                    currentUserData.avatarUrl = newAvatarUrl;
                    updateUserInfo(currentUserData);
                    alert('Avatar updated successfully!');
                    backBtnFromRestoration.dispatchEvent(new Event('click'));
                };

                reader.readAsDataURL(file);
            }
        });
    }

    // Card image upload logic
    const uploadStudentCardBtn = document.getElementById('upload-student-card-btn');
    const studentCardUploadInput = document.getElementById('student-card-upload-input') as HTMLInputElement;
    const studentCard = document.getElementById('card-1');

    const uploadResidenceCardBtn = document.getElementById('upload-residence-card-btn');
    const residenceCardUploadInput = document.getElementById('residence-card-upload-input') as HTMLInputElement;
    const residenceCard = document.getElementById('card-2');

    const handleCardImageUpload = (file: File, cardElement: HTMLElement) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result as string;
            cardElement.style.backgroundImage = `url(${imageUrl})`;
            alert('Card image updated!');
        };
        reader.readAsDataURL(file);
    };

    if (uploadStudentCardBtn && studentCardUploadInput && studentCard) {
        uploadStudentCardBtn.addEventListener('click', () => studentCardUploadInput.click());
        studentCardUploadInput.addEventListener('change', (event) => {
            const target = event.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                handleCardImageUpload(target.files[0], studentCard);
            }
        });
    }

    if (uploadResidenceCardBtn && residenceCardUploadInput && residenceCard) {
        uploadResidenceCardBtn.addEventListener('click', () => residenceCardUploadInput.click());
        residenceCardUploadInput.addEventListener('change', (event) => {
            const target = event.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                handleCardImageUpload(target.files[0], residenceCard);
            }
        });
    }


    // Initialize the app with default user data and language
    updateUserInfo(currentUserData);
    setLanguage('en');
});