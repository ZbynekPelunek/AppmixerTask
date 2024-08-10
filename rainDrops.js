let HIDE_ELEVATION_NUMBERS = false;
let CURRENT_TRAP = [];

function trap(height) {
    console.log('Height array: ', height);
    const noSpaceMessage = 'No space for rain drops :(';
    document.getElementById('no-space-rain-drops').textContent = '';

    let minHeight = 0;
    let maxHeight = 0;
    let leftSide = 0;
    let rightSide = height.length - 1;
    let leftMax = 0;
    let rightMax = 0;
    let rainWaterDrops = 0;

    height.forEach(h => {
        if (h > maxHeight) maxHeight = h;
    });

    minHeight = maxHeight;
    height.forEach(h => {
        if (minHeight > h) minHeight = h;
    });

    const rectSize = document.getElementById('elevation-size').value;
    const paperWidth = rectSize * height.length;
    const paperHeight = rectSize * maxHeight;

    const namespace = joint.shapes;

    const graph = new joint.dia.Graph({}, { cellNamespace: namespace });

    const paper = new joint.dia.Paper({
        el: document.getElementById('paper'),
        model: graph,
        width: paperWidth,
        height: paperHeight,
        background: { color: '#F5F5F5' },
        cellViewNamespace: namespace
    });

    let lowestLevels = 0;
    for (let i = 0; i < height.length; i++) {
        const rect = new joint.shapes.standard.Rectangle();
        rect.position(i * rectSize, paperHeight - (height[i] * rectSize));
        rect.resize(rectSize, height[i] * rectSize);
        rect.addTo(graph);

        rect.attr('body', { fill: '#000000' });

        if (!HIDE_ELEVATION_NUMBERS) rect.attr('label', { text: height[i], fill: '#FFFFFF' });

        if (height[i] === minHeight) lowestLevels++;
    }

    if ((lowestLevels + 1) === height.length || lowestLevels === height.length) {
        document.getElementById('no-space-rain-drops').textContent = noSpaceMessage;
        return 0;
    }

    while (leftSide < rightSide) {
        if (height[leftSide] < height[rightSide]) {
            if (height[leftSide] >= leftMax) {
                leftMax = height[leftSide];
            } else {
                const leftSideElevationText = leftMax - height[leftSide];
                const rect = new joint.shapes.standard.Rectangle();
                rect.position(leftSide * rectSize, paperHeight - (leftMax * rectSize));
                rect.resize(rectSize, (rectSize * leftMax) - (rectSize * height[leftSide]));
                rect.addTo(graph);

                rect.attr('body', { fill: '#0000ff' });

                if (!HIDE_ELEVATION_NUMBERS) rect.attr('label', { text: leftSideElevationText, fill: '#FFFFFF' });
                rainWaterDrops += leftMax - height[leftSide];
            }
            leftSide++;

        } else {
            if (height[rightSide] >= rightMax) {
                rightMax = height[rightSide];
            } else {
                const rightSideElevationText = rightMax - height[rightSide];
                const rect = new joint.shapes.standard.Rectangle();
                rect.position(rightSide * rectSize, paperHeight - (rightMax * rectSize));
                rect.resize(rectSize, (rectSize * rightMax) - (rectSize * height[rightSide]));
                rect.addTo(graph);

                rect.attr('body', { fill: '#0000ff' });

                if (!HIDE_ELEVATION_NUMBERS) rect.attr('label', { text: rightSideElevationText, fill: '#FFFFFF' });
                rainWaterDrops += rightMax - height[rightSide];
            }
            rightSide--;
        }
    }

    if (rainWaterDrops === 0) document.getElementById('no-space-rain-drops').textContent = noSpaceMessage;

    return rainWaterDrops;
};

function generateExample1() {
    const height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
    CURRENT_TRAP = height;

    const rainDrops = trap(height);
    document.getElementById('rain-drop-amount').textContent = rainDrops;
}

function generateExample2() {
    const height = [4, 2, 0, 3, 2, 5];
    CURRENT_TRAP = height;

    const rainDrops = trap(height);
    document.getElementById('rain-drop-amount').textContent = rainDrops;
}

function generateNewTrap() {
    const minTrapLength = 3;
    const minTrapHeight = 1;
    const maxTrapLength = 10;
    const maxTrapHeight = 7;

    const newTrapLength = Math.round(Math.random() * (maxTrapLength - minTrapLength) + minTrapLength);
    const newTrapHeight = Math.round(Math.random() * (maxTrapHeight - minTrapHeight) + minTrapHeight);

    const newTrap = [];
    for (let i = 0; i < newTrapLength; i++) {
        const newElevation = Math.round(Math.random() * newTrapHeight);
        newTrap.push(newElevation);
    }

    CURRENT_TRAP = newTrap;
    const rainDrops = trap(newTrap);
    document.getElementById('rain-drop-amount').textContent = rainDrops;
}

function toggleElevenationNumbers() {
    HIDE_ELEVATION_NUMBERS = !HIDE_ELEVATION_NUMBERS;
    if (CURRENT_TRAP.length <= 0) return;
    trap(CURRENT_TRAP);
}

function changeElevationRectangleSize() {
    if (CURRENT_TRAP.length <= 0) return;
    trap(CURRENT_TRAP);
}