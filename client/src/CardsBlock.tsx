import { styled } from '@mui/system';
import Grid from '@mui/material/Grid';

const CardsBlock = styled(Grid)({
    justifyContent: 'left'
});
const CardsBlockItem = styled(Grid)({
    width: '19vw', justifyContent: 'center', display: 'flex'
});

export {CardsBlock, CardsBlockItem};