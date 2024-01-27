import {
    boundingBox,
    boundingBoxProperties,
    cueBallProperties,
    bottomLeftCueBall,
    bottomMiddleCueBall,
    bottomRightCueBall,
    leftMiddleCueBall,
    rightMiddleCueBall,
    topRightCueBall,
    topMiddleCueBall,
    topLeftCueBall,
} from "../interactionhelpers";




export function showResizeHandlesAndBoundingBox(){

    boundingBox.style.left = `${boundingBoxProperties.left}px`;
    boundingBox.style.top = `${boundingBoxProperties.top}px`;
    boundingBox.style.width = `${boundingBoxProperties.width}px`;
    boundingBox.style.height = `${boundingBoxProperties.height}px`;
    boundingBox.style.display = "block";

    setCueBallProperties(bottomLeftCueBall, `${cueBallProperties.bottomLeft.x}px`, `${cueBallProperties.bottomLeft.y}px`);
    setCueBallProperties(bottomMiddleCueBall, `${cueBallProperties.bottomMiddle.x}px`, `${cueBallProperties.bottomMiddle.y}px`);
    setCueBallProperties(bottomRightCueBall, `${cueBallProperties.bottomRight.x}px`, `${cueBallProperties.bottomRight.y}px`);
    setCueBallProperties(leftMiddleCueBall, `${cueBallProperties.leftMiddle.x}px`, `${cueBallProperties.leftMiddle.y}px`);
    setCueBallProperties(rightMiddleCueBall, `${cueBallProperties.rightMiddle.x}px`, `${cueBallProperties.rightMiddle.y}px`);
    setCueBallProperties(topLeftCueBall, `${cueBallProperties.topLeft.x}px`, `${cueBallProperties.topLeft.y}px`);
    setCueBallProperties(topMiddleCueBall, `${cueBallProperties.topMiddle.x}px`, `${cueBallProperties.topMiddle.y}px`);
    setCueBallProperties(topRightCueBall, `${cueBallProperties.topRight.x}px`, `${cueBallProperties.topRight.y}px`);

}


function setCueBallProperties(
    cueBall: HTMLDivElement,
    left: string,
    top: string,
) {
    cueBall.style.left = left;
    cueBall.style.top = top;
    cueBall.style.display = "block";
}