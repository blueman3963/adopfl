import { useEffect, useRef } from 'react'
import styles from './list.module.scss'

const cds = Array(4).fill({
    title: 'Democracy Seminar',
    desctiption: 'Tristique est, risus, nullam commodo. Eu tortor purus consequat urna cursus eu diam nunc posuere.',
    tags: ['Research','Wireframe','Prototype','UI/UX Design']
})

const List = () => {

    return <div className={styles.list}>
        {
            cds.map((cd,idx) => <Card key={`card_${idx}`} data={cd}/>)
        }
    </div>
}

const Card = ({data}) => {

    const cardRef = useRef()

    return <div className={styles.card} ref={cardRef}>
        <div className={styles.cover}>

        </div>
        <div className={styles.title}>
            {data.title}
        </div>
        <div className={styles.desctiption}>
            {data.desctiption}
        </div>
        <div className={styles.tags}>
            {
                data.tags.map((tag, idx) => <div key={`tag_${idx}`}>{tag}</div>)
            }
        </div>
        
    </div>
}

export default List