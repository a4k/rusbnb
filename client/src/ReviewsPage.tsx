import * as React from 'react';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/system';
import { styled } from '@mui/system';
import {ReviewsBlock} from './ReviewsBlock';
import Review from './Review';

const MainBox = styled(Box)({
    width: '72vw', marginLeft: '14vw', marginTop: '5vh', backgroundColor: 'none', marginBottom: '10vh'
}),
Line = styled(Box)({
    width: '100%', height: '0.1vh', backgroundColor: 'gray', marginTop: '2vh', marginBottom: '3vh'
})

export default function ReviewPage(){
    const {id} = useParams();
    return (
    <MainBox>
        <Typography sx={{fontSize: '2rem'}}>Норм вилла в айайай</Typography>
        <Typography sx={{fontSize: '1.5rem'}}>&#9733; 4.39 &#183; 29 отзывов</Typography>
        <Line></Line>
        <ReviewsBlock container>
                <Review
                userId={5}
                rate={4.89}
                text={'Кайф отзыв'}
                short = {false}
                />
                <Review
                userId={5}
                rate={4.89}
                text={'Кайф отзыв1. d4 Nf6 2. c4 g6 3. Nc3 d5 4. Bf4 Bg7 5. Nf3 O-O 6. e3 { D93 Grünfeld Defense: Three Knights Variation, Hungarian Variation } c5 7. dxc5 Qa5 8. Qd2 dxc4 9. Bxc4 Qxc5 10. Qd4 Qxd4 11. Nxd4 Nh5 12. Bg3 Nxg3 13. hxg3 Nc6 14. Nxc6 bxc6 15. O-O Rb8 16. Rab1 Rd8 17. Rfd1 Bg4 18. Rxd8+ Rxd8 19. Kf1 Bf5 20. e4 Bc8 21. Ke2 Rd4 22. Bd3 Rb4 23. a3 Rb3 24. Bc2 Ba6+ 25. Ke3 Rb8 26. Na4 Rd8 27. Rd1 Rxd1 28. Bxd1 Bf1 29. Bf3 Kf8 30. Nc3 c5 31. Kd2 Bd4 32. Ke1 Bd3 33. Kd2 c4 34. b3 Bxf2 35. bxc4 Bxc4 36. Be2 Bxe2 37. Nxe2 Bc5 38. a4 e6 39. Kc3 Ke7 40. Kc4 Be3 41. Kb5 Kd6 42. Ka6 Kc5 43. Kxa7 Kb4+ 44. Kb7 Kxa4 45. Kc6 Kb3 46. Kd6 Kc4 47. e5 Bc5+ 48. Kd7 Kd5 49. Ke8 Kxe5 50. Kxf7 g5 51. Kg7 Ke4 52. Kf6 e5 53. Kxg5 Be3+ 54. Kg4 Kd3 55. Kf5 Kxe2 56. Kxe5 Kf2 57. Kf5 Kxg3 *'}
                short = {false}
                />
                <Review
                userId={5}
                rate={4.89}
                text={'Кайф отзыв'}
                short = {false}
                />
            </ReviewsBlock>
    </MainBox>)
}