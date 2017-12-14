import Link from 'next/link'

const Header = ({ home, ...props }) => (
  <Link href="/">
    <div className={home ? 'home' : 'other'}>
      <h1>resources</h1>
      <style jsx>{`
        div {
          background-color: #1969a9;
          cursor: pointer; 
        }
        div.home {
          text-align: center;
        }
        h1 {
          color: #f7f7f7;
          font-size: 16px;
        }
        .home h1 {
          position: relative;
          font-size: 52px;
          top: 13px;
          padding-top: 10px;
        }
        .other h1 {
          padding: 5px;          
        }
      `}</style>
    </div>
  </Link>
)

export default Header