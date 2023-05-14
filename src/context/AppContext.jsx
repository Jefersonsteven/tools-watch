"use client";
import { createContext, useState } from "react";
import axios from "axios";
const AppContext = createContext();

function AppProvider({ children }) {
  const [userId, setUserId] = useState("932a3adf-9203-4b25-89ca-777b00411730");
  const [postDetail, setPostDetail] = useState({});

  const [selectedCategory, setSelectedCategory] = useState("");
  const [rent, setRent] = useState("");
  const [sale, setSale] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [name, setName] = useState("");
  /* Crear estado para saber si el usuario esta logeado o no (booleano) */
  const [userSession, setUserSession] = useState(false);
 
    const [title, setTitle] = useState('');
    const [cards, setCards] = useState([]);
    const [selectedType, setSelectedType] = useState('');    
    const [searchTerm, setSearchTerm] = useState(''); 
    const [filteredCards, setFilteredCards] = useState(cards)   
    const [filter, setFilter] = useState('')

    // const getPosts = async () => {
    //   const response = await axios.get('http://localhost:3000/api/admin/post');
    //   return response.data;
    // }
    
    const tools = async () => {
      const response = await axios.get('http://localhost:3000/api/admin/post');
      return response.data;
    }

    // const tools = [
    //     { title: 'Martillo', category: 'Carpintería', rating: 4, price: 5.5, photo: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6RE25sL7PPH-WQsGEqThwl_pnSf04ZHsCQtL1C5fjRyk9Stp7GZaC6PbI_GtfHS2hGS8&usqp=CAU'], description: 'Martillo de carpintería con mango de madera' ,type: 'LEASE' },
    //     { title: 'Sierra circular', category: 'Carpintería', rating: 5, price: 120, photo: ['https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSzLA__pyI7l9mqP3oDMx9o6MTBI3XpzaohFSRlVl3F5Cm6-I81gOBrGujE6LGTrMV6smj4CAQgJGtU1R1pV0kS97rfzCHwS61FaFM8-6H79ZOO7fwu0iuTXsgWUQ2C_IUpmwI&usqp=CAc'], description: 'Sierra circular profesional con hoja de 12 pulgadas', type: 'SALE' },
    //     { title: 'Taladro', category: 'Electricidad', rating: 4, price: 10 , photo: ['https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRBarmuk7dbs9TBrq7b4mcACyo_BarqRJKcLad_x219aO-9GFgkmRG5aQZ4zzUVLhc7jlF2DfYgNfpukczq9FD3koPd8fPLPCgD6KHpdXjDLz75yUXWvfU0AiaI5F9OPsfphms&usqp=CAc'], description: 'Taladro de percusión con cable de 10 pies', type: 'LEASE' },
    //     { title: 'Amoladora', category: 'Electricidad', rating: 3, price: 90, photo: ['https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR7XtSHjObVZ1gYSBGsiAjf1cYI66F5hAFeGP8kBtwabxOBdjYE8VypFH-OBj8Xf7M2mcL5w4RUEyEGrnQLkgM4lpE0wKApMy1Wgtmjs_czzJWBi9O66-W6tL6RUnfZPJ3rvw&usqp=CAc'], description: 'Amoladora angular de 4.5 pulgadas con velocidad variable',type: 'SALE' },
    //     { title: 'Pala', category: 'Excavación', rating: 2, price: 3, photo: ['https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQWsdFgFwKeh0QOobzWmz7Hg7-Eh49BHDpHQo3cumjg4Ygwea7UnGu3A9B0ZvwLxmS87SUwux3UGdIL_0qDlxr1nrwFEZmUvkye2ljFcEhyMrBmO0Oy3GF4R5KuUEfNl7PrXA&usqp=CAc'], description: 'Pala cuadrada con mango de madera de 48 pulgadas',type: 'LEASE' },
    //     { title: 'Martillo perforador', category: 'Excavación', rating: 0, price: 150, photo: ['https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRmUlklTGBNEDLcsUn6yeRL9ZrDGeUwk4k4QHz_2tquPp5hSC1REqd8eFuez3FFUwT6bE_Dt4n794uAvPOJ6MMVWzqqSmwHlxN1QwJ1FEQHn9gtv-qimIIixVE3toO52HEWk-w&usqp=CAc'], description: 'Martillo perforador de alta potencia con mandril de 1/2 pulgada' ,type: 'SALE'},
    //     { title: 'Cortacésped', category: 'Jardinería', rating: 4, price: 30 , photo: ['https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRVszEOu1Pe7afrlEKJcGK__yfbJ4n62G1HTxzlT6N4TTSDmOPLTlh_iOcl4R3aCoWhUCpeT_luIlZmlh8grNTOIIEKpKMeJYdQ9YYQt7CpX7wY69myeitr9zaSaqIYAS_bPIY&usqp=CAc'], description: 'Cortacésped a gasolina de 21 pulgadas con tracción trasera' ,type: 'LEASE'},
    //     { title: 'Tijeras de podar', category: 'Jardinería', rating: 0, price: 5, photo: ['https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQ_9NAmeJK2WFmkzY3OUrErWzySJyH3-G-GDKoofCkAPGa_IH5Rq7SprK5Hn3jebGp9UhLkNsMUzzA-n1OrkLP8A6ETCBCMFq0NEiTfkGlP79Zd6EqwkN81wot4XC2Rcv5urrs&usqp=CAc'], description: 'Tijeras de podar de acero con mango ergonómico' ,type: 'LEASE' }
    //   ];

    return (
        <AppContext.Provider value={{            
            postDetail,
            setPostDetail,
            cards,
            setCards,
            selectedCategory,
            setSelectedCategory,
            title,
            setTitle,
            userId,
            setUserId,
            selectedType,
            setSelectedType,
            sortBy,
            setSortBy,
            searchTerm,
            setSearchTerm,
            tools,
            filteredCards,
            setFilteredCards,
            rent,
            setRent,
            sale,
            setSale,
            name,
            setName,
            filter,
            setFilter,    
            userId,
            setUserId,
            userSession,
            setUserSession,
        }}>
            {children}
        </AppContext.Provider >   
  );
}

export { AppProvider, AppContext };
