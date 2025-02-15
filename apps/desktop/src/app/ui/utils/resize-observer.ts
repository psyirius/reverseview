export function createResizeSensor(element: HTMLElement, onResize: ({ width, height }) => void) {
    const sensor = document.createElement('iframe');
    sensor.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        opacity: 0; /* Make it invisible */
        pointer-events: none; /* Make it non-interactive */
        z-index: -1; /* Place it behind the content */
    `;

    sensor.onload = function() {
        // contentWindow is the window object of the iframe
        sensor.contentWindow.addEventListener('resize', function() {
            onResize({ width: element.offsetWidth, height: element.offsetHeight });
        });

        // Initial trigger in case the div is already resized on load
        onResize({ width: element.offsetWidth, height: element.offsetHeight });
    };

    element.appendChild(sensor);

    return sensor; // Optional: Return the sensor for later removal if needed
}