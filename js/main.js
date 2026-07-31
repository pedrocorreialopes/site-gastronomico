/**
 * Receitas Saborosas — JavaScript Principal
 * Criado e desenvolvido por Pedro Correia Lopes Filho
 *
 * Funcionalidades:
 * - Menu mobile e navegação scroll
 * - Carrossel de depoimentos
 * - Calculadora de orçamento interativa
 * - Filtro e busca de blog
 * - FAQ accordion
 * - Envio de formulários via Table API
 * - WhatsApp flutuante com mensagem pré-definida
 * - Modal de vídeo
 * - Toast notifications
 * - AOS animations
 * - Acessibilidade e lazy loading
 */

(function () {
  'use strict';

  // ============================================================
  // CONFIGURAÇÕES GLOBAIS
  // ============================================================
  const CONFIG = {
    whatsappNumber: '5585999999999',
    whatsappMessage: 'Olá, Receitas Saborosas! Gostaria de solicitar uma proposta.',
    apiBaseUrl: 'tables/',
    toastDuration: 5000
  };

  // ============================================================
  // UTILITÁRIOS
  // ============================================================
  const utils = {
    debounce: (fn, delay) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
      };
    },

    formatCurrency: (value) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    },

    formatPhone: (value) => {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      }
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    },

    showToast: (title, message, type = 'success') => {
      const toast = document.getElementById('toast');
      const toastTitle = document.getElementById('toast-title');
      const toastMessage = document.getElementById('toast-message');
      const icon = toast.querySelector('i');

      if (!toast || !toastTitle || !toastMessage) return;

      toastTitle.textContent = title;
      toastMessage.textContent = message;

      if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle text-red-400 text-xl mt-0.5';
        toast.classList.remove('border-gourmet-gold/30');
        toast.classList.add('border-red-400/30');
      } else {
        icon.className = 'fas fa-check-circle text-gourmet-gold text-xl mt-0.5';
        toast.classList.add('border-gourmet-gold/30');
        toast.classList.remove('border-red-400/30');
      }

      toast.classList.remove('hidden');
      requestAnimationFrame(() => toast.classList.add('show'));

      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300);
      }, CONFIG.toastDuration);
    },

    setLoading: (button, loading) => {
      if (loading) {
        button.classList.add('is-loading');
        button.disabled = true;
      } else {
        button.classList.remove('is-loading');
        button.disabled = false;
      }
    },

    // Constrói string de script tag de forma segura (evita </script> literal no inline)
    safeScriptTag: (isClosing) => {
      return isClosing ? '<' + '/script>' : '<' + 'script>';
    }
  };

  // ============================================================
  // API DE TABELAS (Table API)
  // ============================================================
  const tableAPI = {
    async create(tableName, data) {
      try {
        const response = await fetch(`${CONFIG.apiBaseUrl}${tableName}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Erro ao criar registro:', error);
        throw error;
      }
    }
  };

  // ============================================================
  // HEADER E NAVEGAÇÃO
  // ============================================================
  function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!menuBtn || !mobileMenu) return;

    const toggleMenu = () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        menuBtn.setAttribute('aria-expanded', 'true');
        menuBtn.innerHTML = '<i class="fas fa-times text-2xl"></i>';
      } else {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
      }
    };

    menuBtn.addEventListener('click', toggleMenu);

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
      });
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const headerHeight = document.getElementById('header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  // ============================================================
  // CARROSSEL DE DEPOIMENTOS
  // ============================================================
  function initTestimonialCarousel() {
    const track = document.getElementById('testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    const dots = document.querySelectorAll('.testimonial-dot');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let autoPlayInterval;

    const updateCarousel = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, index) => {
        if (index === currentIndex) {
          dot.classList.add('active');
          dot.classList.remove('bg-white/30');
          dot.classList.add('bg-gourmet-gold');
        } else {
          dot.classList.remove('active');
          dot.classList.add('bg-white/30');
          dot.classList.remove('bg-gourmet-gold');
        }
      });
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    };

    const goToSlide = (index) => {
      currentIndex = index;
      updateCarousel();
    };

    const startAutoPlay = () => {
      autoPlayInterval = setInterval(nextSlide, 6000);
    };

    const stopAutoPlay = () => {
      clearInterval(autoPlayInterval);
    };

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); stopAutoPlay(); startAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); stopAutoPlay(); startAutoPlay(); });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
        stopAutoPlay();
        startAutoPlay();
      });
    });

    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoPlay);
      carousel.addEventListener('mouseleave', startAutoPlay);
    }

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    if (carousel) {
      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
      }, { passive: true });

      carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) nextSlide();
          else prevSlide();
        }
        startAutoPlay();
      }, { passive: true });
    }

    updateCarousel();
    startAutoPlay();
  }

  // ============================================================
  // CALCULADORA DE ORÇAMENTO
  // ============================================================
  function initBudgetCalculator() {
    const pessoasInput = document.getElementById('calc-pessoas');
    const pessoasValue = document.getElementById('calc-pessoas-value');
    const categoriaSelect = document.getElementById('calc-categoria');
    const totalEl = document.getElementById('calc-total');
    const porPessoaEl = document.getElementById('calc-por-pessoa');
    const taxaEl = document.getElementById('calc-taxa');
    const totalResumoEl = document.getElementById('calc-total-resumo');
    const tipoServicoInputs = document.querySelectorAll('input[name="tipo-servico"]');

    if (!pessoasInput || !categoriaSelect) return;

    const precos = {
      basico: 45,
      premium: 75,
      vip: 120
    };

    const calcular = () => {
      const pessoas = parseInt(pessoasInput.value, 10);
      const categoria = categoriaSelect.value;
      const tipoServico = document.querySelector('input[name="tipo-servico"]:checked')?.value || 'buffet';

      let precoBase = precos[categoria] || precos.premium;

      // Servido adiciona 15% ao valor por pessoa
      if (tipoServico === 'servido') {
        precoBase *= 1.15;
      }

      const subtotal = pessoas * precoBase;
      const taxaServico = subtotal * 0.10;
      const total = subtotal + taxaServico;

      pessoasValue.textContent = `${pessoas} pessoas`;
      porPessoaEl.textContent = utils.formatCurrency(precoBase);
      taxaEl.textContent = utils.formatCurrency(taxaServico);
      totalEl.textContent = utils.formatCurrency(total);
      totalResumoEl.textContent = utils.formatCurrency(total);
    };

    pessoasInput.addEventListener('input', calcular);
    categoriaSelect.addEventListener('change', calcular);
    tipoServicoInputs.forEach(input => input.addEventListener('change', calcular));

    calcular();
  }

  // ============================================================
  // BLOG: FILTRO E BUSCA
  // ============================================================
  function initBlogFilter() {
    const filterButtons = document.querySelectorAll('.blog-filter');
    const blogCards = document.querySelectorAll('.blog-card');
    const searchInput = document.getElementById('blog-search');

    if (filterButtons.length === 0 || blogCards.length === 0) return;

    const filterBlog = (category, searchTerm = '') => {
      const term = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      blogCards.forEach(card => {
        const cardCategory = card.dataset.category;
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const excerpt = card.querySelector('p')?.textContent.toLowerCase() || '';
        const normalizedTitle = title.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const normalizedExcerpt = excerpt.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const matchesCategory = category === 'all' || cardCategory === category;
        const matchesSearch = term === '' || normalizedTitle.includes(term) || normalizedExcerpt.includes(term);

        if (matchesCategory && matchesSearch) {
          card.style.display = 'block';
          card.style.animation = 'slideDown 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    };

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => {
          btn.classList.remove('active', 'bg-gourmet-gold', 'text-gourmet-black');
          btn.classList.add('bg-gray-100', 'text-gray-600');
        });
        button.classList.add('active', 'bg-gourmet-gold', 'text-gourmet-black');
        button.classList.remove('bg-gray-100', 'text-gray-600');

        const category = button.dataset.filter;
        filterBlog(category, searchInput?.value || '');
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', utils.debounce(() => {
        const activeFilter = document.querySelector('.blog-filter.active')?.dataset.filter || 'all';
        filterBlog(activeFilter, searchInput.value);
      }, 300));
    }
  }

  // ============================================================
  // FAQ ACCORDION
  // ============================================================
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';

        // Fecha todos os outros
        faqItems.forEach(otherItem => {
          const otherQuestion = otherItem.querySelector('.faq-question');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherQuestion !== question) {
            otherQuestion.setAttribute('aria-expanded', 'false');
            otherAnswer.classList.add('hidden');
          }
        });

        // Toggle atual
        question.setAttribute('aria-expanded', !isExpanded);
        if (isExpanded) {
          answer.classList.add('hidden');
        } else {
          answer.classList.remove('hidden');
        }
      });
    });
  }

  // ============================================================
  // FORMULÁRIOS E CAPTURA DE LEADS
  // ============================================================
  function initForms() {
    // Lead form (Como Funciona)
    const leadFormCF = document.getElementById('lead-form-como-funciona');
    if (leadFormCF) {
      leadFormCF.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = leadFormCF.querySelector('button[type="submit"]');
        utils.setLoading(submitBtn, true);

        const formData = new FormData(leadFormCF);
        const data = {
          nome: formData.get('nome'),
          email: formData.get('email'),
          telefone: formData.get('telefone'),
          tipo: 'proposta',
          origem: 'como-funciona',
          status: 'novo'
        };

        try {
          await tableAPI.create('leads', data);
          utils.showToast('Proposta solicitada!', 'Em breve nossa equipe entrará em contato.');
          leadFormCF.reset();
        } catch (error) {
          utils.showToast('Erro ao enviar', 'Tente novamente ou fale pelo WhatsApp.', 'error');
        } finally {
          utils.setLoading(submitBtn, false);
        }
      });
    }

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        utils.setLoading(submitBtn, true);

        const formData = new FormData(contactForm);
        const data = {
          nome: formData.get('nome'),
          email: formData.get('email'),
          telefone: formData.get('telefone'),
          assunto: formData.get('assunto'),
          mensagem: formData.get('mensagem'),
          tipo: formData.get('assunto') || 'outros'
        };

        try {
          await tableAPI.create('contatos', data);
          utils.showToast('Mensagem enviada!', 'Recebemos sua mensagem e responderemos em breve.');
          contactForm.reset();
        } catch (error) {
          utils.showToast('Erro ao enviar', 'Tente novamente ou fale pelo WhatsApp.', 'error');
        } finally {
          utils.setLoading(submitBtn, false);
        }
      });
    }

    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        utils.setLoading(submitBtn, true);

        const emailInput = document.getElementById('newsletter-email');
        const data = {
          nome: 'Inscrito Blog',
          email: emailInput.value,
          origem: 'blog',
          tags: ['newsletter', 'blog']
        };

        try {
          await tableAPI.create('newsletter', data);
          utils.showToast('Inscrição confirmada!', 'Você receberá nossos conteúdos exclusivos.');
          newsletterForm.reset();
        } catch (error) {
          utils.showToast('Erro ao inscrever', 'Tente novamente mais tarde.', 'error');
        } finally {
          utils.setLoading(submitBtn, false);
        }
      });
    }

    // Máscara de telefone
    document.querySelectorAll('input[type="tel"]').forEach(input => {
      input.addEventListener('input', (e) => {
        e.target.value = utils.formatPhone(e.target.value);
      });
    });
  }

  // ============================================================
  // MODAL DE VÍDEO
  // ============================================================
  function initVideoModal() {
    const playBtn = document.getElementById('play-video-btn');
    const modal = document.getElementById('video-modal');
    const closeBtn = document.getElementById('close-video-modal');

    if (!playBtn || !modal || !closeBtn) return;

    const openModal = () => {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    };

    playBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });
  }

  // ============================================================
  // AOS ANIMATIONS
  // ============================================================
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        disable: 'mobile' // Desabilita em mobile para melhor performance
      });
    }
  }

  // ============================================================
  // LAZY LOADING E OTIMIZAÇÃO
  // ============================================================
  function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      }, { rootMargin: '50px' });

      images.forEach(img => imageObserver.observe(img));
    } else {
      images.forEach(img => img.classList.add('loaded'));
    }
  }

  // ============================================================
  // WHATSAPP FLUTUANTE
  // ============================================================
  function initWhatsAppFloat() {
    const whatsappBtn = document.querySelector('a[href*="wa.me"]');
    if (!whatsappBtn) return;

    whatsappBtn.addEventListener('click', () => {
      // Aqui poderia registrar o evento em analytics
      console.log('WhatsApp clicado');
    });
  }

  // ============================================================
  // SCROLL SPY (Navegação ativa)
  // ============================================================
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.remove('text-gourmet-gold');
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.classList.add('text-gourmet-gold');
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    sections.forEach(section => observer.observe(section));
  }

  // ============================================================
  // INICIALIZAÇÃO
  // ============================================================
  function init() {
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initTestimonialCarousel();
    initBudgetCalculator();
    initBlogFilter();
    initFAQ();
    initForms();
    initVideoModal();
    initAOS();
    initLazyLoading();
    initWhatsAppFloat();
    initScrollSpy();
  }

  // Aguarda DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
