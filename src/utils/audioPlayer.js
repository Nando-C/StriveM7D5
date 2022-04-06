import { useDispatch, useSelector } from "react-redux";
import { setIsPlaying, setCurrentTime } from "../redux/slices/currentSong";

const dispatch = useDispatch;
const isPlaying = useSelector((state) => state.currentSong.isPlaying);
const currentTime = useSelector((state) => state.currentSong.currentTime);
