import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import Popover from '@mui/material/Popover';

const DDMenuItem = styled(Box)({
    display: 'flex', 
    width: '100%', 
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: '10px',
    padding: '1rem 0',
    borderBottom: '2px #EBEBEB solid',
    '&:last-child': {
        borderBottom: 'none'
    },
}),
DDMainTypo = styled(Typography)({
    userSelect: 'none', 
    fontWeight: '500', 
    flexBasis: '9ch',
}),
DDValue = styled(Typography)({
    width: '3rem', 
    textAlign: 'center', 
    userSelect: 'none',
    fontWeight: '500'
}),
DDBtn = styled(Button)({
    fontSize: '1rem', 
    height: '1.6rem', 
    maxWidth: '2rem !imporant', 
    padding: '0', 
    minWidth: '2rem'
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
/**
 * Попап компонент
 * @param props.title Текст, который отображается в компоненте
 * @param props.primary true для четкого черного цвета текста
 * @param props.width ширина компонента, по умолчанию - 100%
 * @param props.height  высота компонента, по умолчанию - 2.5rem
 * @param props.error показывать ошибку?
 * @param props.variant filled или standard - вариант компонента
 */
export default function Popup(props: Props){
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [openDropDown, setOpenDD] = React.useState(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };

    const open = Boolean(anchorEl);
    const anchorRef = React.useRef<HTMLDivElement | null>(null);

    return (
        <>
            <Box 
                ref={anchorRef}
                sx={{
                    width: props.width || '100%', 
                    minHeight: props.height || '2.5rem', 
                    position: 'relative', 
                    marginTop: props.variant==='filled'?'0':'0.5rem'
                }}
            >
                <Typography 
                    sx={
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
                    onClick={handleClick}
                >
                    {props.title}
                </Typography>
                <Popover
                    open={open}
                    onClose={handleClose}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    PaperProps={{
                        style: {
                            width: anchorRef.current ? anchorRef.current.clientWidth : 'auto',
                            minWidth: '145px',
                            padding: '0.5rem 1rem 0 1rem',
                            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                            border: '1px solid #CDCDCD',
                        }
                    }}
                >
                    {props.children}
                </Popover>
            </Box>
        </>
    )
}

type ItemProps = {
    value: number,
    onChange?: (newValue : number) => void,
    min?: number,
    max?: number,
    title: string,
    error?: boolean,
    color?: "inherit" | "info" | "primary" | "secondary" | "success" | "error" | "warning"
}

/**
 * Элемент попапа с кнопками - +
 * @param props.onChange функция, которая вызывается при изменении значения
 * @param props.min минимальное значение, по умолчанию - 0
 * @param props.max  максимальное значение, по умолчанию - Infinity
 * @param props.title Подпись к элементу
 * @param props.error показывать ошибку?
 * @param props.color Цвет кнопок
 */
function PopupItem(props: ItemProps){
    /**
     * Вызывает функцию props.onChange(newValue),
     * если она указана
     * @param newValue новое значение
     */
    const changeValue = (newValue: number) =>{
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
                                    disabled={props.value === (props.min || 0)}
                                    onClick={()=>{if(props.value > (props.min || 0)) changeValue(props.value-1)}}
                                >
                                &mdash;
                                </DDBtn>
                                <DDValue 
                                    sx={{
                                        color: props.error?'red':'black'
                                    }}
                                >
                                    {props.value}
                                </DDValue>
                                <DDBtn 
                                    size='small'
                                    variant="contained"
                                    color={props.color || "info"}
                                    disabled={props.value === (props.max || Infinity)}
                                    onClick={()=>{if(props.value < (props.max || Infinity)) changeValue(props.value+1)}}
                                >
                                    +
                                </DDBtn>
                            </Box>
                        </DDMenuItem>
        </>
    )
}

export {PopupItem};