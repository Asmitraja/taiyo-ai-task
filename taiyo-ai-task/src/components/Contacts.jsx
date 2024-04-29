import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { Box, Button, Flex, Heading, Popover, PopoverCloseButton, PopoverContent, PopoverTrigger, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { v4 } from "uuid";
import { useDispatch } from 'react-redux';
import { addContact } from '../Redux/Add_Contacts/addContacts.action.js';
import "../Css/Contact.css";

const getData = async () => {
    return await axios.get("https://taiyo-ai-server.onrender.com/contacts");
};

const Contacts = () => {
    const [flag, setFlag] = useState(false);
    const [contacts, setContacts] = useState({ name: "", lastName: "", status: "" });
    const [edit, setEdit] = useState({ name: "", lastName: "", status: "" });
    const [data, setData] = useState([]);
    const dispatch = useDispatch();
    const [view, setView] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContacts({ ...contacts, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (contacts.name && contacts.lastName && contacts.status) {
            dispatch(addContact({ id: v4(), ...contacts }));
            message.success("Contact Added Successfully");
        } else {
            message.error("Please fill all credentials");
        }
        setContacts({ name: "", lastName: "", status: "" });
    };

    const handleChangeEdit = (e) => {
        const { name, value } = e.target;
        setEdit({ ...edit, [name]: value });
    };

    const handleSubmitEdit = (e, id) => {
        e.preventDefault();
        try {
            axios.put(`https://taiyo-ai-server.onrender.com/contacts/${id}`, { name: edit.name, lastName: edit.lastName, status: edit.status })
                .then(() => message.success("Contact Edited Successfully"))
                .then(() => getData().then((res) => setContacts(res.data)));
        } catch (err) {
            console.log(err);
        }
    };

    const deleteContact = (id) => {
        axios.delete(`https://taiyo-ai-server.onrender.com/contacts/${id}`)
            .then((res) => message.success("Contact Deleted Successfully"))
            .then(() => getData().then((res) => setContacts(res.data)));
    };

    useEffect(() => {
        getData().then((res) => setData(res.data));
    }, [handleSubmit]);

    const onOpen = () => {
        setFlag(true);
    };

    const onClose = () => {
        setFlag(false);
    };

    const viewContact = () => {
        setView(!view);
    };

    return (
        <div id="contact_page" className="bg-gray-200 min-h-screen">
            <div style={{ height: '70px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#212833', marginBottom: "1px" }}>
                <Heading className='mukta-extralight' style={{ color: 'white', padding: '10px 20px', fontSize: "40px" }}>Contacts Page</Heading>
            </div>
            <Flex>
                {/* Sidebar */}
                <Box bg="#343a40" color="white" p={4} w="20%">
                    <Box mb={6}>

                        <Link to="/" className="text-white">
                            <Text mb={2}>Contacts</Text>
                        </Link>
                        <Link to="/chartsandmaps" className="text-white">
                            <Text>Charts & Maps</Text>
                        </Link>
                    </Box>
                </Box>

                {/* Main Content */}
                <Box w="100%" p={6}>



                    <div id="contact_page_div">
                        <Box padding={"30px"} margin={'auto'} w={"79%"} boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"} border={"1px solid gray"}>
                            {flag ?

                                <form onSubmit={handleSubmit} id="form" className="space-y-4">
                                    <div className="flex justify-end">
                                        <button onClick={onClose} className="text-red-500">X</button>
                                    </div>
                                    <label htmlFor="name" className="text-blue-500">First Name:</label>
                                    <input type="text" id="name" name="name" value={contacts.name} onChange={handleChange} className="border border-gray-400 rounded-md p-2" />
                                    <label htmlFor="lastName" className="text-blue-500">Last Name:</label>
                                    <input type="text" id="lastName" name="lastName" value={contacts.lastName} onChange={handleChange} className="border border-gray-400 rounded-md p-2" />
                                    <label htmlFor="status" className="text-blue-500">Status:</label>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="statusActive" name="status" value="active" onChange={handleChange} checked={contacts.status === "active"} />
                                        <label htmlFor="statusActive" className="text-blue-500 ml-2">Active</label>
                                        <input type="checkbox" id="statusInactive" name="status" value="inactive" onChange={handleChange} checked={contacts.status === "inactive"} />
                                        <label htmlFor="statusInactive" className="text-blue-500 ml-2">Inactive</label>
                                    </div>
                                    <Button type="submit" bg="#007bff" color="white" borderRadius="5px" padding="10px 20px" fontSize="16px" fontWeight="bold" border="none" _hover={{ bg: "#0056b3" }}>Save Contact</Button>
                                </form> :

                                <Button marginTop={"20px"} onClick={onOpen} bg="#007bff" color="white" style={{ cursor: "pointer", borderRadius: "5px", padding: "10px 20px", fontSize: "16px", fontWeight: "bold", border: "none", width: "300px" }} _hover={{ bg: "#0056b3" }}>
                                    Create Contact
                                </Button>

                            }
                            {data.length < 1 ?
                                <Box id="empty" margin={"auto"} marginTop={"4%"} width={"50%"} border={"1px solid gray"}>
                                    <Heading>No Contact Found, Please add contact from Create Contact Button</Heading>
                                </Box> :
                                <Box marginTop={"4%"}>
                                    <div id="data_container">
                                        {data.map((el) => (
                                            <div key={el.id}>
                                                <h3>{el.name} {el.lastName}</h3>

                                                <Popover>
                                                    <PopoverTrigger>
                                                        <Button onClick={viewContact} bg="#007bff" color="white" cursor="pointer" borderRadius="5px" padding="10px 20px" fontSize="16px" fontWeight="bold" border="none" _hover={{ bg: "#0056b3" }}>View</Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent backgroundColor={'white'} padding={'20px'} color='white' margin={'auto'}>
                                                        <PopoverCloseButton>Close</PopoverCloseButton>
                                                        <Text color={"black"}>First Name: {el.name}</Text>
                                                        <Text color={"black"}>Last Name: {el.lastName}</Text>
                                                        <Text color={"black"}>Status: {el.status}</Text>
                                                    </PopoverContent>
                                                </Popover>
                                                <Popover>
                                                    <PopoverTrigger>
                                                        <Button bg="#28a745" color="white" cursor="pointer" borderRadius="5px" padding="10px 20px" fontSize="16px" fontWeight="bold" border="none" _hover={{ bg: "#218838" }}>Edit</Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent backgroundColor={'white'} padding={'10px'} color='white' margin={'auto'}>
                                                        <PopoverCloseButton marginTop={"15px"}>Close</PopoverCloseButton>
                                                        <label style={{ color: "#28a745", display: "block" }}>First Name:</label>
                                                        <input type="text" id="name" name="name" value={edit.name} onChange={handleChangeEdit} className="border border-green-500 rounded-md p-2" />
                                                        <label style={{ color: "#28a745", display: "block" }}>Last Name:</label>
                                                        <input type="text" id="lastName" name="lastName" value={edit.lastName} onChange={handleChangeEdit} className="border border-green-500 rounded-md p-2" />
                                                        <label style={{ color: "#28a745", display: "block" }}>Status:</label>
                                                        <div className="flex items-center">
                                                            <input type="checkbox" id="statusActiveEdit" name="status" value="active" onChange={handleChangeEdit} checked={edit.status === "active"} />
                                                            <label htmlFor="statusActiveEdit" className="text-green-500 ml-2">Active</label>
                                                            <input type="checkbox" id="statusInactiveEdit" name="status" value="inactive" onChange={handleChangeEdit} checked={edit.status === "inactive"} />
                                                            <label htmlFor="statusInactiveEdit" className="text-green-500 ml-2">Inactive</label>
                                                        </div>
                                                        <button onClick={(e) => handleSubmitEdit(e, el.id)} style={{ backgroundColor: "#28a745", color: "#ffffff", cursor: "pointer", border: "none", padding: "10px 20px", borderRadius: "5px", fontSize: "16px", fontWeight: "bold", marginTop: "10px" }}>Submit</button>
                                                    </PopoverContent>
                                                </Popover>
                                                <Button onClick={() => deleteContact(el.id)} bg="red" color="ffffff" cursor="pointer" borderRadius="5px" padding="10px 20px" fontSize="16px" fontWeight="bold" border="none" _hover={{ bg: "#0056b3" }}>Delete</Button>
                                            </div>
                                        ))}
                                    </div>
                                </Box>
                            }
                        </Box>
                    </div>
                </Box>
            </Flex>
        </div>
    );
};

export default Contacts;