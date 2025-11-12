jQuery(document).ready(function ($) {
  // Swiper가 로드되어 있고 타겟이 있을 때만 초기화 (중복 초기화 방지)
  const $visual = $(".visual_swiper");
  let visual_swiper = null;

  if (typeof Swiper !== "undefined" && $visual.length) {
    // Swiper가 이미 초기화 되어 있으면 재초기화 방지
    if ($visual.hasClass("swiper-initialized")) {
      visual_swiper = $visual[0].swiper || null;
    } else {
      // Swiper 인스턴스 생성
      visual_swiper = new Swiper(".visual_swiper", {
        direction: "horizontal",
        loop: true,
        centeredSlides: true,
        slidesPerView: "auto",
        autoplay: { delay: 2500, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", type: "progressbar" },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },

        // 성능 최적화 옵션
        observer: true,
        observeParents: true,
        watchOverflow: true,
        preloadImages: false,
        lazy: { loadPrevNext: true, loadPrevNextAmount: 1 },
        speed: 600,
        watchSlidesProgress: true,

        // 커스텀 fraction 업데이트 이벤트
        on: {
          init: function () {
            updateFraction(this);
          },
          slideChange: function () {
            updateFraction(this);
          },
        },
      });
    } // if-else

  // 커스텀 fraction 업데이트 함수
    function updateFraction(swiper) {
      // loop 옵션이 true일 때만 loopedSlides를 고려
      if (swiper.params.loop) {
        const current = swiper.realIndex + 1;
        const total = swiper.slides.length - (swiper.loopedSlides * 2);
        $(".custom-fraction .current").text(current);
        $(".custom-fraction .total").text(total);
      } else {
        // loop가 false일 때는 단순히 activeIndex + 1과 전체 슬라이드 수
        const current = swiper.activeIndex + 1;
        const total = swiper.slides.length;
        $(".custom-fraction .current").text(current);
        $(".custom-fraction .total").text(total);
      }
    }

    // 재생/일시정지 버튼 기능 (요소 유무 체크)
    const $autoplayToggleBtn = $("#btn-autoplay-toggle");
    const $playIcon = $("#icon-play");
    const $pauseIcon = $("#icon-pause");
    let isPlaying = true;

    if ($autoplayToggleBtn.length && visual_swiper) {
      $autoplayToggleBtn.on("click", function () {
        if (isPlaying) {
          if (
            visual_swiper.autoplay &&
            typeof visual_swiper.autoplay.stop === "function"
          )
            visual_swiper.autoplay.stop();
          $playIcon.removeClass("hidden");
          $pauseIcon.addClass("hidden");
        } else {
          if (
            visual_swiper.autoplay &&
            typeof visual_swiper.autoplay.start === "function"
          )
            visual_swiper.autoplay.start();
          $playIcon.addClass("hidden");
          $pauseIcon.removeClass("hidden");
        }
        isPlaying = !isPlaying;
      });
    }
  }

  // 다른 페이지/공통 스크립트는 여기 아래에 계속 작성
  // 예: if ($('.product-list').length) { ... }
});

 // 문서가 준비되면 playYoutubeOnHover 함수를 호출합니다.
    playYoutubeOnHover();

// jQuery 3.6.0 기반: .short-section 후손 iframe(유튜브) 마우스 오버 시 자동재생/일시정지 기능 함수화
// 다른 코드에 영향 없이 필요할 때 호출해서 사용하세요.
function playYoutubeOnHover() {
	if (typeof jQuery === 'undefined') return;
	if (jQuery('.short-section').length === 0) return;

	jQuery('.short-section iframe').each(function() {
		var $iframe = jQuery(this);
		// 이미 enablejsapi=1이 있으면 중복 추가 방지
		var src = $iframe.attr('src');
		if (src && src.indexOf('youtube.com') !== -1 && src.indexOf('enablejsapi=1') === -1) {
			var sep = src.indexOf('?') === -1 ? '?' : '&';
			$iframe.attr('src', src + sep + 'enablejsapi=1');
		}
	});

	jQuery('.short-section iframe').off('mouseenter.playYoutubeOnHover mouseleave.playYoutubeOnHover');

	jQuery('.short-section iframe').on('mouseenter.playYoutubeOnHover', function() {
		var iframe = this;
		// 유튜브 플레이어에 postMessage로 재생 명령
		iframe.contentWindow.postMessage(JSON.stringify({
			event: 'command',
			func: 'playVideo',
			args: ''
		}), '*');
	});

	jQuery('.short-section iframe').on('mouseleave.playYoutubeOnHover', function() {
		var iframe = this;
		// 유튜브 플레이어에 postMessage로 일시정지 명령
		iframe.contentWindow.postMessage(JSON.stringify({
			event: 'command',
			func: 'pauseVideo',
			args: ''
		}), '*');
		// stopVideo를 사용하려면 아래 주석을 해제하세요.
		iframe.contentWindow.postMessage(JSON.stringify({
		  event: 'command',
		  func: 'stopVideo',
		  args: ''
		}), '*');
	});
}