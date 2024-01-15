import Header from '../components/header'
import Background from '../components/background'
import { useState } from 'react'

const Home = () => {

    const [init, setInit] = useState(false)

    return <div>
        <Background launch={setInit}/>
        {
            init&&<>
                <Header />
            </>
        }
    </div>
}

export default Home