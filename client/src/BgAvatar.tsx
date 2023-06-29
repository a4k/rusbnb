export default function BgAvatar(name: string) {
    const minVal = "a".charCodeAt(0),
    maxVal = "z".charCodeAt(0),
    c = (name[0] || 'h').toLowerCase().charCodeAt(0);
    let firstVal = (c-minVal)/(maxVal-minVal)*255;
    if(firstVal == 0) {firstVal = (c*2-minVal)/(maxVal-minVal)*255;}
    let secondVal = 255-firstVal,
    thirdVal = (firstVal*2)%256;
    return `linear-gradient(0deg, rgba(${firstVal*0.6},${secondVal*0.6},${thirdVal*0.6},1) 0%, rgba(${firstVal},${secondVal},${thirdVal},1) 100%);`
}