import styles from './header.module.scss'
import cx from 'classnames'
import List from '../list'
import { useState, useRef, useEffect } from 'react'

const Header = () => {
    const [ page, setPage ] = useState(null)
    const [ mute, setMute ] = useState(false)
    const bgm = useRef()

    const changePage = (target) => {
        if(page === target) { 
            setPage(null)
        } else if(page !== null) {
            setPage(null)
            setTimeout(() => {
                setPage(target)
            },300)
        } else {
            setPage(target)
        }
    }

    useEffect(() => {
        if(mute){ 
            bgm.current.volume = 0
        } else {
            bgm.current.volume = 1
        }
    },[mute])

    return <><div className={styles.header}>
        <div onClick={() => changePage('works')} className={page==='works'?styles.active:''}>Works</div>
        <div onClick={() => changePage('about')} className={page==='about'?styles.active:''}>About</div>
        <a href='mailto:adofeng@gmail.com' target='_blank'>Contact</a>
        <div className={cx(styles.volume, {[styles.muted]:mute})} onClick={() => setMute(!mute)}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.mute}>
                <div className={styles.mutebar}></div>
                <div className={styles.mutebar}></div>
                <div className={styles.mutebar}></div>
                <div className={styles.mutebar}></div>
            </div>
        </div>
    </div>
    <audio ref={bgm} autoPlay src='audio/Dilating Times - Jam No. 1.mp3' />
    <div className={styles.greetings}>{
        'Ado Feng is a designer based in New York'.split('').map(letter => <span>{letter}</span>)
    }</div>
    <div className={cx(styles.content, {[styles.active]:page==='works'})}>
        <List />
    </div>
    <div className={cx(styles.content, {[styles.active]:page==='about'})}>
        <div className={styles.about}>
        Hello!
        <br/><br/>
        I’m a highly-motivated and multidisciplinary designer based in New York and New Jersey. I’m passionate about UI/UX design, and taste in fashion. I received my bachelor's degree in Fashion from Montclair State University and a master's degree in Communication Design from Parsons School of Design in New York.
        <br/><br/>
        I value human interaction, adaptability, collaboration, but never restricts myself in any design style, and embrace diversity and innovation in my work.
        Through different experiences and work across multiple fields, I’ve learned the ability to gather things together. This allows me to execute my design vision.
        <br/><br/>
        Offline, I'm interested in 🍖️, 📷, 🎸, and 🎮️. 
        </div>
    </div>
    </>
}

export default Header