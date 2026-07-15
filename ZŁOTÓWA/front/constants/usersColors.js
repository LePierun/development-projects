export function generateColorFromId(id) {

    const colors = [
        "#F44336",
        "#E91E63",
        "#9C27B0",
        "#673AB7",
        "#3F51B5",
        "#2196F3",
        "#009688",
        "#4CAF50",
        "#FF9800",
        "#795548",
    ];

    return colors[id % colors.length];
}