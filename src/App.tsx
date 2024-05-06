// Library imports
import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import {DialogContent, IconButton} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

// CSS import
import './App.css';

// Asset imports
import hexagonBlack from './assets/hexagon_black.svg';
import hexagonWhite from './assets/hexagon_white.svg';
import hexagonPurple from './assets/hexagon_purple.svg';
import hexagonBorder from './assets/hexagon_border.svg';

const radiusOutside = 60;
const radiusInside = radiusOutside / (2 / Math.sqrt(3));
const cSizeX = 6;
const cSizeY = 7;

enum HexagonType {
    BLACK = 'black',
    WHITE = 'white',
    PURPLE = 'purple',
    NONE = 'border',
}

// Hexagon images map
const hexagonImages = {
    [HexagonType.BLACK]: hexagonBlack,
    [HexagonType.WHITE]: hexagonWhite,
    [HexagonType.PURPLE]: hexagonPurple,
    [HexagonType.NONE]: hexagonBorder,
}

const defaultStyle = {
    position: "absolute",
    padding: 0,
};

function imageSrcFromType(type: HexagonType) {
    return hexagonImages[type] || hexagonImages[HexagonType.NONE];
}

const getStyledImageDiv = (type: HexagonType, positionX: number, positionY: number) => {
    const style = {
        ...defaultStyle,
        left: positionX,
        top: positionY
    };

    return (
        <div style={style}>
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

// Hexagon properties
type HexagonProps = {
    positionX: number;
    positionY: number;
    elementX: number;
    elementY: number;
    type: HexagonType // add more types as needed
};

function Hexagon({ positionX, positionY, elementX, elementY, type }: HexagonProps) {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event: React.MouseEvent) => {
        event.stopPropagation();
        setOpen(false);
    };

    return (
        <div onClick={handleClick}>
            {getStyledImageDiv(type, positionX, positionY)}
            {getHexagonPropertiesDialog(open, handleClose, { positionX, positionY, elementX, elementY, type })}
        </div>
    );
}

type HexMapProps = {
    sizeX: number;
    sizeY: number;
    hexagons: HexagonProps[]; // add type for each Hexagon
};

function HexMap({ hexagons }: HexMapProps) {
    return (
        <div>
            {hexagons.map((hexagon, index) =>
                <Hexagon key={index} {...hexagon} />
            )}
        </div>
    );
}

function computeHexPositions(_: HexagonProps[],index: number) {
    const elementX = Math.floor(index / cSizeY);
    const elementY = index % (cSizeY);
    const positionX = (2*elementX*radiusInside) + ((elementY % 2)*radiusInside) - (radiusOutside - radiusInside);
    const positionY = elementY * radiusOutside * 2 - ((elementY % (cSizeY + 1)) * 0.5 * radiusOutside);

    const type = HexagonType.NONE;
    return { positionX, positionY, elementX, elementY, type };
}

function debugCheckerboard(_: HexagonProps[]) {
    for (let index = 0; index < _.length; index++) {
        _[index].type = index % 2 === 0 ? HexagonType.BLACK : HexagonType.WHITE;
    }
}

function App() {
    const hexagons = [...Array(cSizeX * cSizeY)].map(computeHexPositions);
    debugCheckerboard(hexagons);
    return (
        <div>
            <HexMap sizeX={cSizeX} sizeY={cSizeY} hexagons={hexagons} />
        </div>
    );
}

export default App;
