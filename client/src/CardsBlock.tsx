import { styled } from '@mui/system';
import Grid from '@mui/material/Grid';

const CardsBlock = styled(Grid)({
    justifyContent: 'space-evenly',
    gridAutoRows: '1fr',
    gridTemplateColumns: 'repeat(4, 1fr)',
    rowGap: '2vh',
});
const CardsBlockItem = styled(Grid)({
    width: '20vw', justifyContent: 'center', display: 'flex',
    minWidth: '200px'
});

export {CardsBlock, CardsBlockItem};