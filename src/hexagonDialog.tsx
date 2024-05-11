import React, { forwardRef, Ref, ComponentType } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {DialogContent, IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Slide, { SlideProps } from '@mui/material/Slide';
import './hexagonDialog.css'

type HexagonProps = {
    positionX: number;
    positionY: number;
    elementX: number;
    elementY: number;
    type: HexagonType;
    isDragging: boolean;
};

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

const Transition = forwardRef(function Transition(
    props: SlideProps,
    ref: Ref<unknown>,
): ReturnType<typeof Slide> {
    return <Slide direction="up" ref={ref} {...props} />;
}) as ComponentType<Omit<SlideProps, 'direction'>>;

const getHexagonPropertiesDialog = (
    open: boolean,
    handleClose: (_: React.MouseEvent, reason: string) => void,
    { positionX, positionY, elementX, elementY, type }: HexagonProps
) => {
    return (
        <Dialog
            fullScreen
            TransitionComponent={Transition}
            open={open}
            onClose={handleClose}
            PaperProps={{ style: { backgroundColor: 'transparent' } }}
        >
            <DialogTitle
            className="hexagon-properties-dialog-Title">
                Hexagon Properties {type}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={(event) => handleClose(event, 'close')}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'rgba(255,255,255, 1)',
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent
                className="hexagon-properties-dialog-Body">
                <p>Hexagon-Coordinates (px): {Math.floor(positionX)} | {Math.floor(positionY)}</p>
                <p>Hexagon-Coordinates (M) : {elementX} | {elementY}</p>
            </DialogContent>
        </Dialog>
    );
};

export default getHexagonPropertiesDialog;