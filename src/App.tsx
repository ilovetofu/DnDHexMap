// react-window.d.ts
declare module 'react-window';
// Library imports
import React, { useState } from 'react';
import {FixedSizeList as List} from 'react-window'
import Draggable from 'react-draggable';
import { DraggableEvent, DraggableData } from 'react-draggable';
//import Dialog from '@mui/material/Dialog';
//import DialogTitle from '@mui/material/DialogTitle';
//import {DialogContent, IconButton} from "@mui/material";
import getHexagonPropertiesDialog from './hexagonDialog.tsx'
// CSS import
import './App.css';

// Assets
//import CloseIcon from '@mui/icons-material/Close';
//import CastleIcon from '@mui/icons-material/Castle';
//import CabinIcon from '@mui/icons-material/Cabin';

// Asset imports
import hexagonMountain1path0 from './assets/HexMapMountain.png';
import hexagonPlains1Path0 from './assets/HexMapPlains1.png';
import hexagonForest1Path0 from './assets/HexMapForest1PathXXXXXXXXX.png';
import hexagonForest1Path1 from './assets/HexMapForest1Path000XXX240.png';
import hexagonForest1Path2 from './assets/HexMapForest1Path000120XXX.png';
import hexagonForest1Path3 from './assets/HexMapForest1PathXXX120240.png';
import hexagonForest1Path4 from './assets/HexMapForest1Path000120240.png';
import hexagonNone from './assets/HexMapNONE.png';

const radiusOutside = 120;
const radiusInside = radiusOutside / (2 / Math.sqrt(3));
const cSizeX = 5;
const cSizeY = 5;

enum HexagonType {
    PLAINS1 =       'plains1path0',
    MOUNTAIN1 =     'mountain1path0',
    FOREST1 =       'forest1path0',
    FOREST1PATH1 =  'forest1path1',
    FOREST1PATH2 =  'forest1path2',
    FOREST1PATH3 =  'forest1path3',
    FOREST1PATH4 =  'forest1path4',
    NONE = 'border',
}

// Hexagon images map
const hexagonImages = {
    [HexagonType.PLAINS1]:      hexagonPlains1Path0,
    [HexagonType.MOUNTAIN1]:    hexagonMountain1path0,
    [HexagonType.FOREST1]:      hexagonForest1Path0,
    [HexagonType.FOREST1PATH1]: hexagonForest1Path1,
    [HexagonType.FOREST1PATH2]: hexagonForest1Path2,
    [HexagonType.FOREST1PATH3]: hexagonForest1Path3,
    [HexagonType.FOREST1PATH4]: hexagonForest1Path4,
    [HexagonType.NONE]: hexagonNone,
}

const DEFAULT_HEXAGON_TYPE = HexagonType.NONE;

/**
 * Returns the image source path for a given hexagon type.
 *
 * @param {HexagonType} type - The type of hexagon.
 * @return {string} - The image source path for the specified type.
 */
function imageSrcFromType(type: HexagonType): string {
    return hexagonImages[type] || hexagonImages[DEFAULT_HEXAGON_TYPE];
}

function useHexMapDrag() {
    const [isDragging, setIsDragging] = useState(true);

    const handleDragStart = (event: DraggableEvent) => {
        console.log("drag start");
        event.stopPropagation();
        setIsDragging(true);
    }

    const handleDragStop = (event: DraggableEvent, data: DraggableData) => {
        event.stopPropagation();
        console.log("drag stop");
        setIsDragging(false);
        updateHexPositions(data.x, data.y, hexagons);
    }

    const handleMouseInteraction = (event: React.MouseEvent) => {
        console.log("mouse interaction");
        console.log(event);
        event.preventDefault();
    }

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
        <div>
            <div style={{position: "absolute", left: positionX, top: positionY}}>
                <img className="hexagon" src={imageSrcFromType(type)} alt={`hexagon ${type}`} onClick={handleClick}/>
            </div>
                {getHexagonPropertiesDialog(open, handleClose, {isDragging, positionX, positionY, elementX, elementY, type })}        </div>
    );
}

function computeHexPositions(_: HexagonProps[], index: number) {
    const elementY = Math.floor(index / cSizeY);
    const elementX = index % cSizeX;
    const positionX = (2 * elementX * radiusInside) + ((elementY % 2) * radiusInside) - (radiusOutside - radiusInside);
    const positionY = elementY * radiusOutside * 2 - ((elementY % cSizeY) * 0.5 * radiusOutside);
    const type = HexagonType.NONE;
    return { positionX, positionY, elementX, elementY, type , isDragging: false};
}

function updateHexPositions(newPositionX: number, newPositionY: number, _: HexagonProps[]) {
    for (let index = 0; index < _.length; index++) {
        _[index].positionX += newPositionX;
        _[index].positionY += newPositionY
    }
}

function debugCheckerboard(_: HexagonProps[]) {
    for (let index = 0; index < _.length; index++) {
        _[index].type = index % 2 === 0 ? HexagonType.NONE : HexagonType.PLAINS1;
        if(index % 3 === 0)  {_[index].type = HexagonType.FOREST1;}
        if(index % 4 === 0)  {_[index].type = HexagonType.FOREST1PATH1;}
        if(index === 0 || index === 1 || index === 7)  {_[index].type = HexagonType.FOREST1PATH4;}
    }
}

type HexMapProps = {
    hexagons: HexagonProps[];
    isDragging: boolean;
};

function HexMap({ hexagons, isDragging }: HexMapProps) {
    return (
        <div>
            {hexagons.map((hexagon, index) =>
                <Hexagon key={index} {...hexagon} isDragging={isDragging}/>
            )}
        </div>
    );
}

const hexagons = [...Array(cSizeX * cSizeY)].map(computeHexPositions);
debugCheckerboard(hexagons);

function App() {
    const { isDragging, handleDragStart, handleDragStop, handleMouseInteraction } = useHexMapDrag();
    return (
        <div className="map-frame">
            <List className="no-scrollbars" itemSize={1} height={window.innerHeight} itemCount={1} width={window.innerWidth} >
                {() => (
                    <div style={{position: "absolute", top: 0, left: 0}}
                        onDragStart={handleMouseInteraction}
                        onContextMenu={handleMouseInteraction}>
                        <Draggable onDrag={handleDragStart} onStop={handleDragStop}>
                            <div>
                                <HexMap hexagons={hexagons} isDragging={isDragging} />
                            </div>
                        </Draggable>
                    </div>
                )}
            </List>
        </div>
    );
}

export default App;