// module.js
document.addEventListener('DOMContentLoaded', () => {
  const steps = Array.from(document.querySelectorAll('.ww-step'));
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  let current = 0;

  const showStep = idx => {
    steps.forEach((s,i) => s.classList.toggle('active', i === idx));
    prevBtn.style.visibility = idx === 0 ? 'hidden' : 'visible';
    nextBtn.textContent = idx === steps.length - 1 ? 'Calculate' : 'Next';
  };

  showStep(current);

  prevBtn.addEventListener('click', () => {
    if (current > 0) { current--; showStep(current); }
  });

  nextBtn.addEventListener('click', () => {
    if (current < steps.length - 1) {
      current++; showStep(current);
    } else {
      calculateResults();
    }
  });

  // departments slider display
  const deptInput = document.querySelector('input[name="departments"]');
  const deptValue = document.getElementById('departments-value');
  deptInput.addEventListener('input', e => deptValue.textContent = e.target.value);

  // enable others text
  const othersCb = document.getElementById('others-checkbox');
  const othersTxt = document.getElementById('others-text');
  othersCb.addEventListener('change', () => {
    othersTxt.disabled = !othersCb.checked;
  });

  function calculateResults() {
    // gather values
    const empMap = {'1-10':1,'11-50':2,'51-200':4,'201-500':6,'501-1000':8,'1000+':10};
    const freqMap = {'Daily':5,'Weekly':3,'Monthly':1,'Rarely':0.5};
    const searchMap = {'0-1':1,'1-5':3,'5-10':7,'10+':12};
    const storageMap = {'Yes':2,'Some':1,'No':0};

    const emp = document.querySelector('input[name="employees"]:checked').value;
    const freq = document.querySelector('input[name="sharing"]:checked').value;
    const deps = parseInt(deptInput.value);
    const fileTypes = document.querySelectorAll('input[name="filetypes"]:checked').length;
    const search = document.querySelector('input[name="search_time"]:checked').value;
    const storage = document.querySelector('input[name="storage"]:checked').value;
    const hourlyRate = parseFloat(document.querySelector('input[name="hourly_rate"]').value) || 0;

    const baseLost = searchMap[search] + freqMap[freq] + (deps * .5) + (fileTypes <=1?0:(fileTypes <=3?1:2)) + storageMap[storage];
    const weekly = (baseLost * empMap[emp]) * .25;
    const annual = weekly * 52;
    let currency = '$';

    // currency detection
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        const symbols = { USD:'$', EUR:'€', GBP:'£' };
        currency = symbols[data.currency] || '$';
      })
      .catch(() => {});
    
    document.getElementById('weekly-savings').textContent = Math.round(weekly);
    document.getElementById('annual-savings').textContent = Math.round(annual);
    document.getElementById('cost-savings').textContent = Math.round(annual * hourlyRate);
    document.getElementById('currency-symbol').textContent = currency;

    document.getElementById('questionnaire').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('lead-form').classList.remove('hidden');
  }

  // simple form validation
  document.getElementById('lead-form').addEventListener('submit', e => {
    const req = ['firstname','lastname','company','email'];
    for (let name of req) {
      if (!document.querySelector(`[name="${name}"]`).value) {
        e.preventDefault();
        alert('Please fill out all required fields.');
        return;
      }
    }
  });
});
