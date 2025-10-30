// 파일 맨 아래에 추가
$(document).ready(function() {

    /* ==================================================================
      맨 위로 가기 (TOP 버튼) 스크립트
    ================================================================== */
    
    // 1. 스크롤하면 버튼 보이기/숨기기
    $(window).scroll(function() {
        if ($(this).scrollTop() > 200) { // 200px 이상 스크롤 되면
            $('#btnTop').fadeIn(); // 버튼을 서서히 보이게
        } else {
            $('#btnTop').fadeOut(); // 버튼을 서서히 숨김
        }
    });

    // 2. 버튼 클릭하면 맨 위로 이동
    $('#btnTop').click(function(e) {
        e.preventDefault(); // a 태그의 기본 동작(페이지 점프) 방지
        
        // 0.4초(400) 동안 부드럽게 스크롤
        $('html, body').animate({scrollTop: 0}, 400); 
        return false;
    });

});