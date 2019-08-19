
function svg() {
    return '<svg viewBox="0 0 180 28">' +
            '    <defs>' +
            '        <filter id="goo">' +
            '            <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />' +
            '            <feColorMatrix in="blur" mode="matrix" values="' +
            '                1 0 0 0 0  ' +
            '                0 1 0 0 0  ' +
            '                0 0 1 0 0  ' +
            '                0 0 0 13 -9" result="goo" />' +
            '            <xfeBlend in="SourceGraphic" in2="goo" />' +
            '        </filter>' +
            '        <path id="wave" d="M 0,10 C 45,10 45,15 90,15 135,15 135,10 180,10 225,10 225,15 270,15 315,15 315,10 360,10 v 28 h -360 z" />' +
            '    </defs>' +

            '    <use id="wave3" class="wave" xlink:href="#wave" x="0" y="-2" />' +
            '    <use id="wave2" class="wave" xlink:href="#wave" x="0" y="0" />' +
            '    <use id="wave1" class="wave" xlink:href="#wave" x="0" y="1" />' +
 
            '    <g class="gooeff" filter="url(#goo)">' +
            '        <circle class="drop drop1" cx="5" cy="5.4" r="8.8" />' +
            '        <circle class="drop drop2" cx="10" cy="3.1" r="7.5" />' +
            '        <circle class="drop drop3" cx="15" cy="8.3" r="9.2" />' +
            '        <circle class="drop drop4" cx="20" cy="5.4" r="9.8" />' +
            '        <circle class="drop drop5" cx="25" cy="6.1" r="7.5" />' +
            '        <circle class="drop drop6" cx="30" cy="4.8" r="9.2" />' +
            '    </g>' +
            '</svg>';
}

document.getElementById('waves').innerHTML = svg();