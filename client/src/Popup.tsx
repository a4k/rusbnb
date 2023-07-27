import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { keyframes } from '@mui/system';

const appear = keyframes`
    from {
        max-height: 1px;
    }
    to{
        max-height: 1000px;
    }
`;

const DDMenuItem = styled(Box)({
    display: 'flex', width: '100%', flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    padding: '1rem 0',
                    borderBottom: '2px #EBEBEB solid',
                    '&:last-child': {borderBottom: 'none'}
}),
DDMainTypo = styled(Typography)({
    userSelect: 'none', fontWeight: '500', flexBasis: '40%'
}),
DDValue = styled(Typography)({
    width: '3rem', textAlign: 'center', userSelect: 'none',
    fontWeight: '500'
}),
DDBtn = styled(Button)({
    fontSize: '1rem', height: '1.6rem', maxWidth: '2rem !imporant', padding: '0', minWidth: '2rem'
});

type Props = {
    error?: boolean,
    children?:
    | React.ReactChild
    | React.ReactChild[],
    title: string,
    primary: boolean,
    width?: string,
    variant?: 'filled'|'standard',
    height?: string
}

export default function Popup(props: Props){
    const [openDropDown, setOpenDD] = React.useState(false);
    return (
        <>
            <Box sx={{width: props.width || '100%', minHeight: props.height || '2.5rem', position: 'relative', marginTop: props.variant==='filled'?'0':'0.5rem'}}>
                <Typography sx={
                    props.
                    variant==='filled'
                        ?{
                            height: '3em',
                            width: '100%', 
                            background: '#CCC', 
                            userSelect: 'none', 
                            display: 'flex', 
                            alignItems: 'center',
                            borderBottom: `1px ${props.error?'red':'#767676'} solid`,
                            borderTopRightRadius: '5px',
                            borderTopLeftRadius: '5px', 
                            paddingLeft: '1rem', 
                            cursor: 'pointer',
                            color: props.error?'red':(props.primary?'#525252':'black')
                        }
                        :{
                            height: '2.5rem',
                            width: '100%', 
                            background: 'white', 
                            userSelect: 'none', 
                            display: 'flex', alignItems: 
                            'center',
                            border: `1px ${props.error?'red':'#CDCDCD'} solid`,
                            borderRadius: '5px', 
                            paddingLeft: '1rem', 
                            cursor: 'pointer',
                            color: props.error?'red':(props.primary?'#525252':'black')
                        }

                }
                onClick={()=>{setOpenDD(!openDropDown)}}> {props.title}</Typography>
                <Box 
                    sx={{
                        display: openDropDown?'flex':'none', 
                        flexDirection: 'column', 
                        backgroundColor: 'white',  
                        position: 'absolute', 
                        width: '100%',
                        borderRadius: '20px', 
                        padding: '.5rem 1.5rem', 
                        justifyContent: 'space-evenly', 
                        marginTop: '0.5rem', 
                        overflow: 'hidden',
                        minWidth: '140px', 
                        transition: 'max-height .3s linear', 
                        zIndex: '1',
                        animation: `${appear} 1s ease-out`,
                        animationFillMode: 'forwards', 
                        border: '1px solid #CDCDCD',
                        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
                    }}
                >        
                        {props.children}
                        
                </Box>
            </Box>
        </>
    )
}

type ItemProps = {
    onChange?: (newValue : number) => void,
    defaultValue?: number,
    min?: number,
    max?: number,
    title: string,
    error?: boolean,
    color?: "inherit" | "info" | "primary" | "secondary" | "success" | "error" | "warning"
}

function PopupItem(props: ItemProps){
    const [value, setValue] = React.useState(props.defaultValue || 0);
    const changeValue = (newValue: number) =>{
        setValue(newValue);
        if(props.onChange) props.onChange(newValue);
    }
    return (
        <>
        <DDMenuItem>
                            <DDMainTypo>{props.title}</DDMainTypo>
                            <Box sx={{display: 'flex'}}>
                                <DDBtn
                                    size='small'
                                    variant="contained"
                                    color={props.color || "info"}
                                    disabled={value === (props.min || 0)}
                                    onClick={()=>{if(value > (props.min || 0)) changeValue(value-1)}}
                                >
                                &mdash;
                                </DDBtn>
                                <DDValue 
                                    sx={{
                                        color: props.error?'red':'black'
                                    }}
                                >
                                    {value}
                                </DDValue>
                                <DDBtn 
                                    size='small'
                                    variant="contained"
                                    color={props.color || "info"}
                                    disabled={value === (props.max || Infinity)}
                                    onClick={()=>{if(value < (props.max || Infinity)) changeValue(value+1)}}
                                >
                                    +
                                </DDBtn>
                            </Box>
                        </DDMenuItem>
        </>
    )
}

export {PopupItem};