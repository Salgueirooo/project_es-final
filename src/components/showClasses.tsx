//import axios from "axios";
import React, { useEffect, useState } from "react";
import { useClasses, deleteClasse, createClasse, updateClasse } from '../hooks/classesHook'
import { useUserId } from "../hooks/userHook";
import Modal from "../modal/modalInfoClassesUser";
import useToken from "../hooks/tokenHook";
import { RxInfoCircled, RxCross2 } from "react-icons/rx";
import { GrConfigure, GrCompliance  } from "react-icons/gr";
import { FaPlus } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { ClassesDto } from "../dto/ClassesDTO";
import { useAttendance, useAttendances, updateAttendance } from "../hooks/attendanceHook";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { statsAttendace, useNStudents, useAttendPerClass } from "../hooks/statsHook";
import { createReview, useAllReviews, useReviews } from "../hooks/reviewHook";
import { UserDto } from "../dto/UsersDTO";
import { useReviewTypes } from "../hooks/serverDataHook";

interface ShowClassesProps {
    curricularUnitSelected: number;
    nameUnitSelected: string | null;
}

const ShowClasses: React.FC<ShowClassesProps> = ({ curricularUnitSelected, nameUnitSelected }) => {
    
    const { classes, error: errorClasses, refreshClasses } = useClasses(curricularUnitSelected);
    
    const [student, setStudent] = useState<UserDto | null>(null);

    const [isModalInfoOpen, setIsModalInfoOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalStatOpen, setIsModalStatOpen] = useState(false);
    const [isModalReviewOpen, setIsModalReviewOpen] = useState(false);
    
    const { decodedToken, error: tokenError } = useToken();
    const isAdmin: boolean = decodedToken?.role?.includes("ROLE_ADMIN");
    const [classeSelected, setClasseSelect] = useState<ClassesDto | null>(null);
    const [nClasseSelected, setnClasseSelected] = useState(0);
    
    const { attendance, error: error5, fetchAttendance } = useAttendance();
    const { attendance: AttendStudents, error: error2, refreshAttendance } = useAttendances(classeSelected?.id ? classeSelected.id : 0);
    
    const { stats, statsTeacher, error: errorStats, fetchStats } = statsAttendace();
    const { nStudents, fetchNStudents } = useNStudents();
    const { attendancesPerClass, error: errorAttend, fetchAttendPClass } = useAttendPerClass();
    
    const { reviews, error: errorReviews, refreshReviews } = useReviews(classeSelected?.id? classeSelected.id : null);
    const { allReviews, error: errorAllRev, fetchReviewsByClassId } = useAllReviews();

    const [summary, setSummary] = useState("");
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const [editSummary, setEditSummary] = useState('');
    const [editDate, setEditDate] = useState('');
    const [editTime, setEditTime] = useState('');

    const [classifReview, setClassifReview] = useState('');
    const [commentReview, setCommentReview] = useState('');
    const [idReview, setIdReview] = useState('');

    const horario = classeSelected?.dateTime ? classeSelected.dateTime.split(' ') : [];

    const { reviewTypes } = useReviewTypes();

    const resetDataClass = () => {
        setSummary("");
        setDate("");
        setTime("");
    };

    const resetDataReview = () => {
        setClassifReview('');
        setCommentReview('');
        setIdReview('');
    }

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createClasse(curricularUnitSelected, date, time, summary, refreshClasses);
        setIsModalAddOpen(false);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateClasse(curricularUnitSelected, classeSelected?.id ? classeSelected.id : 0, editDate, editTime, editSummary, refreshClasses);
        setIsModalEditOpen(false);
    };

    const handleAddReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createReview(curricularUnitSelected, classeSelected?.id? classeSelected.id : 0, student?.id? student.id : 0, classifReview, 
            commentReview, idReview, refreshReviews);
        resetDataReview();
        setIsModalAddOpen(false);
    };

    return (
        <div className="areaClasses">
            <h3 className='titClasses'>Unidade Curricular de {nameUnitSelected}</h3>
            
            <button className="botEstat" onClick={() => {
                setIsModalStatOpen(true); 
                fetchStats(curricularUnitSelected, isAdmin);
                if(isAdmin){
                    fetchNStudents(curricularUnitSelected);
                    fetchAttendPClass(curricularUnitSelected);
                } else {
                    fetchReviewsByClassId(curricularUnitSelected);
                }
            }}>Estatísticas</button>

            {isAdmin && (
                <button className="botAddClasse" onClick={() => (setIsModalAddOpen(true), resetDataClass())}><FaPlus /></button>
            )}
            
            <div className="divTable2">
                <table className="classesTable">
                <thead>
                    <tr>
                        <th>N.º Aula</th>
                        <th>Sumário</th>
                        <th>Horário</th>
                        <th className="actionBot">Info.</th>
                        {isAdmin && (
                            <>
                                <th className="actionBot">Alter.</th>
                                <th className="actionBot">Elim.</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {classes.map((classe, classNumber) => (
                        <tr key={classe.id}>
                            <td className="idClasse">{classNumber+1}</td>
                            <td className="summaryClasse">{classe.summary}</td>
                            <td className="dateClasse">{classe.dateTime}</td>
                            <td className="buttonsClasse">
                                <button className="botInfo" onClick={() => {
                                        setIsModalInfoOpen(true); 
                                        setClasseSelect(classe); 
                                        setnClasseSelected(classNumber+1);
                                        //setidClasseSelected(classe.id);
                                        if (!isAdmin) {
                                            if (classe.dateTime && new Date(classe.dateTime.replace(" ", "T")) <= new Date()) {
                                                fetchAttendance(curricularUnitSelected, classe.id);
                                                refreshReviews();
                                            }
                                        } else {
                                            refreshAttendance(); 
                                        }
                                }}><RxInfoCircled /></button>
                            </td>
                            {isAdmin && (
                            <>
                                <td className="buttonsClasse">
                                    {new Date(classe.dateTime.replace(" ", "T")) > new Date() && (
                                        <button 
                                            className="botConf" onClick={() => (setClasseSelect(classe),
                                            setnClasseSelected(classNumber+1), //setidClasseSelected(classe.id),
                                            setIsModalEditOpen(true),
                                            setEditSummary(classe.summary),
                                            setEditDate(classe.dateTime.split(" ")[0]),
                                            setEditTime(classe.dateTime.split(" ")[1]))}>
                                        <GrConfigure /></button>
                                    )}
                                    
                                </td>
                                <td className="buttonsClasse">
                                    {new Date(classe.dateTime.replace(" ", "T")) > new Date() && (
                                        <button
                                            className="botDel"
                                            onClick={() => (

                                                deleteClasse(curricularUnitSelected, classe.id, refreshClasses)
                                            )}
                                        ><RxCross2 /></button>
                                    )}
                                </td>
                            </>
                            )}
                        </tr>
                    ))}
                </tbody>
                </table>
                {errorClasses && <h5 className='error'>{errorClasses}</h5>}
            </div>

            <Modal isOpen={isModalInfoOpen} onClose={() => setIsModalInfoOpen(false)}>
                
                <div className="zonaInfo">
                    <h2 className="titModal">Detalhes sobre a Aula n.º {nClasseSelected}</h2>
                    <p className="horario0"><b>Data: </b>{horario[0]}</p>
                    <p className="horario1"><b>Horário: </b>{horario[1]}h</p>
                    <div className="bodyModal"></div>
                    {!isAdmin && (
                        <>
                            <p><b>Presença: </b>
                                {classeSelected?.dateTime 
                                    ? new Date(classeSelected.dateTime.replace(" ", "T")) > new Date()
                                        ? "Aula por realizar"
                                        : (attendance ? "Presente" : "Ausente")
                                    : "Data inválida"}
                            </p> 
                        </>
                    )}
                    <p className="summary"><b>Sumário: </b>{classeSelected?.summary}</p>
                    {/* <h2 className="listFactos"></h2> */}
                    {!isAdmin && (
                        <>
                            <h2 className="listFactos"></h2>
                    
                            <div className="divTable4">
                                <table className="factsTable">
                                <thead>
                                    <tr>
                                        <th>Avaliação</th>
                                        <th>Comentário</th>
                                        <th>Categoria</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reviews.map((review) => (
                                        <tr key={review.id}>
                                            
                                            <td className="classifRev">{review.value}</td>
                                            <td className="commentRev">{review.comment}</td>
                                            <td className="typeRev">{review.participationType}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                </table>
                            </div>
                        </>
                    )}
                    {isAdmin && (
                        <div className="zonaInfo2">
                            <h2 className="subTitModal">Lista de alunos</h2>
                            <div className="divTable3">
                                <table className="studentsTable">
                                <thead>
                                    <tr>
                                        <th>N.º</th>
                                        <th>Nome</th>
                                        {new Date(classeSelected?.dateTime.replace(" ", "T")?classeSelected?.dateTime.replace(" ", "T"):'') < new Date() && (
                                            <>
                                                <th className="actionBot">Factos</th>
                                                <th className="actionBot">Presenças</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {AttendStudents.map((student) => (
                                        <tr key={student.id}>
                                            
                                            <td className="idStudent">{student.id}</td>
                                            <td className="nameStudent">{student.name}</td>
                                            {new Date(classeSelected?.dateTime.replace(" ", "T")?classeSelected?.dateTime.replace(" ", "T"):'') < new Date() && (
                                                <>
                                                    <td className="buttonsStud">
                                                        <button className="botFact"
                                                        onClick={() => {
                                                            if (student.state) {
                                                                setIsModalReviewOpen(true);
                                                                resetDataReview();
                                                                setStudent(student);
                                                                refreshReviews();
                                                            } else {
                                                                alert("Os factos deste aluno não podem ser listados visto que um aluno ausente não possui factos.");
                                                            }
                                                        }}><GrCompliance /></button>
                                                    </td>
                                                    <td className="buttonsStud">
                                                        <button className={student.state?"botAttend-true":"botAttend-false"}
                                                        onClick={() => (
                                                            updateAttendance(curricularUnitSelected, classeSelected?.id ? classeSelected.id : 0, student.id, refreshAttendance)
                                                        )}><IoPerson /></button>
                                                    </td>
                                                </>
                                                
                                            )}
                                            
                                        </tr>
                                    ))}
                                </tbody>
                                </table>
                                {error2 && <h5 className='error'>{error2}</h5>}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            <Modal isOpen={isModalEditOpen} onClose={() => setIsModalEditOpen(false)}>
                <div className="zonaInfo">
                    <h2 className="titModal">Editar informações da aula n.º{nClasseSelected}</h2>
                    <form onSubmit={handleEditSubmit} className="form2">
                        <input className="loginLabel"
                            type="date"
                            id="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            required
                            min={new Date().toISOString().split("T")[0]}
                        />
                        <input className="loginLabel"
                            type="time"
                            id="time"
                            value={editTime}
                            onChange={(e) => setEditTime(e.target.value)}
                            required
                        />
                        <textarea
                            id="summary"
                            placeholder="Sumário"
                            value={editSummary}
                            onChange={(e) => setEditSummary(e.target.value)}
                            maxLength={254}
                            rows={4} // Define o número de linhas visíveis
                            cols={50} // (Opcional) Define a largura do textarea
                            style={{ resize: "vertical" }} // Permite redimensionar verticalmente
                        />
                        <button type="submit" className="botSubmit">Alterar aula</button>
                    </form>
                </div>
            </Modal>

            <Modal isOpen={isModalAddOpen} onClose={() => setIsModalAddOpen(false)}>
                <div className="zonaInfo">
                    <h2 className="titModal">Adicionar aula à Unidade Curricular</h2>

                        <form onSubmit={handleAddSubmit} className="form2">
                        <input className="loginLabel"
                            type="date"
                            id="date"
                            //placeholder='Data'
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                        />
                        <input className="loginLabel"
                            type="time"
                            id="time"
                            //placeholder='Horário'
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                        <textarea
                            id="summary"
                            placeholder="Sumário"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            maxLength={254}
                            rows={4} // Define o número de linhas visíveis
                            cols={50} // (Opcional) Define a largura do textarea
                            style={{ resize: "vertical" }} // Permite redimensionar verticalmente
                        />
                        <button type="submit" className="botSubmit">Criar aula</button>
                    </form>                    
                </div>
            </Modal>

            <Modal isOpen={isModalStatOpen} onClose={() => setIsModalStatOpen(false)}>
                <div className="zonaInfo">
                    <h2 className="titModal">Estatísticas da Unidade Curricular</h2>
                    
                    <div className="zonaStats">
                        {!isAdmin &&
                            <>
                                <p style={{ paddingLeft: "8px" }}><b>Aulas assistidas: </b>
                                    {stats?.attended}/{stats?.total} ({((stats?.attended?stats?.attended:0)/
                                    (stats?.total?stats.total:0)*100).toFixed(2)}%)</p>
                                <h2 className="titReviews">Factos</h2>
                                <div className="reviewsByClass">
                                    {allReviews.map((reviewClass, index) => (
                                        <div key={reviewClass.classId}>
                                            <h3>Aula {index + 1}</h3>
                                            <div style={{paddingLeft: "1vw", paddingRight: "1vw"}}>
                                                <table className="factsTable2">
                                                {reviewClass.reviews.length > 0 ? (
                                                    // Se houver reviews, mostra a tabela
                                                    <thead>
                                                        <tr>
                                                            <th>Avaliação</th>
                                                            <th>Comentário</th>
                                                            <th>Categoria</th>
                                                        </tr>
                                                    </thead>
                                                ) : (
                                                    <p style={{margin:"0"}}>Não existem factos nesta aula.</p>
                                                )} 
                                            <tbody>
                                            {reviewClass.reviews.map((facto) => (
                                                    <tr key={facto.id}>
                                                        
                                                        <td className="classifRev">{facto.value}</td>
                                                        <td className="commentRev">{facto.comment}</td>
                                                        <td className="typeRev">{facto.participationType}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            </table>
                                            </div>
                                            
                                            {/* <ul>
                                                {reviewClass.reviews.map((facto) => (
                                                    <li key={facto.id}>{facto.value} - {facto.comment} - {facto.participationType}</li>
                                                ))}
                                            </ul> */}
                                        </div>
                                    ))}
                                </div>
                            </>
                        }
                        
                        {isAdmin &&
                            <div>
                                <p><b>Percentagem média de presenças por aula: </b>
                                    {(statsTeacher*100).toFixed(2)}%</p>
                                <h2 className="listFactos"></h2>
                                <p style={{ textAlign: "center" }}><b>Gráfico de Presenças por Aula</b></p>
                                <div className="graficoBarras">
                                    <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={attendancesPerClass} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <XAxis dataKey="nclass" stroke="#1d2027"/>
                                    <YAxis stroke="#1d2027" domain={[0, nStudents]}/>
                                    <Tooltip contentStyle={{ color: "#1d2027", border: "1px solid #5b070d" }}/>
                                    <Legend 
                                        formatter={() => <span style={{ color: "#1d2027" }}>Presenças</span>}
                                    />
                                    <Bar dataKey="totalAttended" name={"Presenças"} fill="#63090F" activeBar={{ fill: "#5b070d" }} />
                                    </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            
                        }
                    </div>
                    
                </div>
            </Modal>
            <Modal isOpen={isModalReviewOpen} onClose={() => setIsModalReviewOpen(false)}>
                <div className="zonaInfo">
                    <h2 className="titModal">Factos do aluno <i>{student?.name.split(' ')[0]}</i></h2>
                    <form className="form3" onSubmit={handleAddReviewSubmit}>
                        <div className="colRev1">
                            <input
                                className="clasRevLabel"
                                type="number"
                                id="numberInput"
                                value={classifReview}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === "" || (Number(value) >= 0 && Number(value) <= 5)) {
                                        setClassifReview(value);
                                    }
                                }}
                                required
                                min="1"
                                max="5"
                                placeholder="Avaliação (1 a 5)"
                            />
                            <select
                                className="typeRevLabel"
                                id="reviewSelect"
                                value={idReview}
                                onChange={(e) => setIdReview(e.target.value)}
                                required
                                >
                                <option value="" disabled>Selecione uma Categoria</option>
                                {reviewTypes.map((review, index) => (
                                    <option key={review} value={index + 1}>
                                    {review}
                                    </option>
                                ))}
                            </select>
                            <button type="submit" className="botSubmit2">Criar facto</button>
                        </div>
                        <div className="colRev2">
                            <textarea
                                className="commentLabel"
                                id="comment"
                                placeholder="Insira um comentário (opcional)"
                                value={commentReview}
                                onChange={(e) => setCommentReview(e.target.value)}
                                maxLength={254}
                                rows={4} // Define o número de linhas visíveis
                                cols={50} // (Opcional) Define a largura do textarea
                                style={{ resize: "vertical" }} // Permite redimensionar verticalmente
                            />
                        </div>
                    </form>
                    <h2 className="listFactos"></h2>
                    
                    <div className="divTable4">
                        <table className="factsTable">
                        <thead>
                            <tr>
                                <th>Avaliação</th>
                                <th>Comentário</th>
                                <th>Categoria</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((review) => (
                                <tr key={review.id}>
                                    
                                    <td className="classifRev">{review.value}</td>
                                    <td className="commentRev">{review.comment}</td>
                                    <td className="typeRev">{review.participationType}</td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </div>
            </Modal>
        </div>
        
    );
};

export default ShowClasses;

