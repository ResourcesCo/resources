const Nav = ({theme}) => (
  <nav>
    <h1>Resources<span>co</span></h1>
    <style jsx>{`
      h1 {
        text-align: center;
        margin: 0;
        padding: 5px 15px;
        font-size: 32px;
      }

      h1 span {
        font-size: 10px;
        border: 1px solid ${theme.foreground};
        padding: 4px 3px;
        margin-top: -20px;
        text-transform: uppercase;
        border-radius: 5px;
        margin-left: 4px;
        font-weight: normal;
        position: relative;
        top: -5px;
      }
    `}</style>
  </nav>
)

export default Nav
