// Library imports
import React, { useState } from 'react';
import Draggable from 'react-draggable';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import {DialogContent, IconButton} from "@mui/material";

// CSS import
import './App.css';

// Asset imports
import CloseIcon from '@mui/icons-material/Close';
//import CastleIcon from '@mui/icons-material/Castle';
//import CabinIcon from '@mui/icons-material/Cabin';

// Asset imports
import hexagonBlack from './assets/hexagon_black.svg';
import hexagonWhite from './assets/hexagon_white.svg';
import hexagonMountain from './assets/HexMapMountain.png';
import hexagonPlains1Path0 from './assets/HexMapPlains1.png';
import hexagonForest1Path0 from './assets/HexMapForest1PathXXXXXXXXX.png';
import hexagonForest1Path1 from './assets/HexMapForest1Path000XXX240.png';
import hexagonForest1Path2 from './assets/HexMapForest1Path000120XXX.png';
import hexagonForest1Path3 from './assets/HexMapForest1PathXXX120240.png';
import hexagonForest1Path4 from './assets/HexMapForest1Path000120240.png';

const radiusOutside = 120;
const radiusInside = radiusOutside / (2 / Math.sqrt(3));
const cSizeX = 6;
const cSizeY = 7;

enum HexagonType {
    BLACK = 'black',
    WHITE = 'white',
    PLAINS1 = 'purple',
    FOREST1 =       'forest1path0',
    FOREST1PATH1 =  'forest1path1',
    FOREST1PATH2 =  'forest1path2',
    FOREST1PATH3 =  'forest1path3',
    FOREST1PATH4 =  'forest1path4',
    NONE = 'border',
}

// Hexagon images map
const hexagonImages = {
    [HexagonType.BLACK]: hexagonBlack,
    [HexagonType.WHITE]: hexagonWhite,
    [HexagonType.PLAINS1]:      hexagonPlains1Path0,
    [HexagonType.FOREST1]:      hexagonForest1Path0,
    [HexagonType.FOREST1PATH1]: hexagonForest1Path1,
    [HexagonType.FOREST1PATH2]: hexagonForest1Path2,
    [HexagonType.FOREST1PATH3]: hexagonForest1Path3,
    [HexagonType.FOREST1PATH4]: hexagonForest1Path4,
    [HexagonType.NONE]: hexagonMountain,
}

/**
 * Returns the image source path for a given hexagon type.
 *
 * @param {HexagonType} type - The type of hexagon.
 * @return {string} - The image source path for the specified type.
 */
function imageSrcFromType(type: HexagonType): string {
    return hexagonImages[type] || hexagonImages[HexagonType.NONE];
}

const getStyledImageDiv = (type: HexagonType, positionX: number, positionY: number) => {
        return (
        <div style={{position: "absolute", left: positionX, top: positionY}}>
            <img className="hexagon" src={imageSrcFromType(type)} alt={`hexagon ${type}`}/>
        </div>
    );
}

const getHexagonPropertiesDialog = (open: boolean, handleClose: (event: React.MouseEvent) => void, { positionX, positionY, elementX, elementY, type }: HexagonProps) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                Hexagon Properties {type}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent>
                <p>Hexagon-Coordinates (px): {Math.floor(positionX)} | {Math.floor(positionY)}</p>
                <p>Hexagon-Coordinates (M) : {elementX} | {elementY}</p>
            </DialogContent>
        </Dialog>
    );
}

function useHexMapDrag() {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = () => setIsDragging(true);
    const handleDragStop = () => setIsDragging(false);
    const handleMouseInteraction = (event: React.MouseEvent) => event.preventDefault();

    return { isDragging, handleDragStart, handleDragStop, handleMouseInteraction };
}

// Hexagon properties
type HexagonProps = {
    positionX: number;
    positionY: number;
    elementX: number;
    elementY: number;
    type: HexagonType;
    isDragging: boolean;
};

function Hexagon({ positionX, positionY, elementX, elementY, type, isDragging }: HexagonProps & { isDragging: boolean }) {
    const [open, setOpen] = useState(false);

    const handleClick = (event: React.MouseEvent) => {
        if (isDragging) {
            event.stopPropagation();
            return;
        }
        setOpen(true);
    };

    const handleClose = (event: React.MouseEvent) => {
        event.stopPropagation();
        setOpen(false);
    };

    return (
        <div onClick={handleClick}>
            {getStyledImageDiv(type, positionX, positionY)}
            {getHexagonPropertiesDialog(open, handleClose, {isDragging,positionX, positionY, elementX, elementY, type })}
        </div>
    );
}

function computeHexPositions(_: HexagonProps[],index: number) {
    const elementX = Math.floor(index / cSizeY);
    const elementY = index % (cSizeY);
    const positionX = (2*elementX*radiusInside) + ((elementY % 2)*radiusInside) - (radiusOutside - radiusInside);
    const positionY = elementY * radiusOutside * 2 - ((elementY % (cSizeY + 1)) * 0.5 * radiusOutside);

    const type = HexagonType.NONE;
    return { positionX, positionY, elementX, elementY, type , isDragging: false};
}

function debugCheckerboard(_: HexagonProps[]) {
    for (let index = 0; index < _.length; index++) {
        _[index].type = index % 2 === 0 ? HexagonType.NONE : HexagonType.PLAINS1;
        if(index % 3 === 0)  {_[index].type = HexagonType.FOREST1;}
        if(index % 4 === 0)  {_[index].type = HexagonType.FOREST1PATH1;}
        if(index === 0 || index === 1 || index === 7)  {_[index].type = HexagonType.FOREST1PATH4;}
    }
}

function App() {
    const { isDragging, handleDragStart, handleDragStop, handleMouseInteraction } = useHexMapDrag();
    const hexagons = [...Array(cSizeX * cSizeY)].map(computeHexPositions);
    debugCheckerboard(hexagons);

    return (
        <div>
            <Draggable onStart={handleDragStart} onStop={handleDragStop}>
                <div
                    onMouseDown={handleMouseInteraction}
                    onMouseUp={handleMouseInteraction}
                    onMouseMove={handleMouseInteraction}>
                    {hexagons.map((hexagon, index) =>
                        <Hexagon key={index} {...hexagon} isDragging={isDragging}/>
                    )}
                </div>
            </Draggable>
        </div>
    );
}

export default App;
