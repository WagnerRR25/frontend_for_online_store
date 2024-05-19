'use client';


import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import { Estado } from "@/types";
import { EstadoService } from "@/demo/service/cadastro/EstadoService";

const Estados = () => {
    const objetoNovo: Estado = {
        id: '',
        nome: '',
        sigla: ''
    };

    const [objetos, setObjetos] = useState<Estado[]>([]);
    const [selectedEstados, setSelectedEstados] = useState<Estado[]>([]);

    const [objetoDialog, setObjetoDialog] = useState(false);
    const [objetoDeleteDialog, setObjetoDeleteDialog] = useState(false);
    const [objeto, setObjeto] = useState<Estado>(objetoNovo);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const estadoService = useMemo(() => new EstadoService(), []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await estadoService.buscarTodos();
                setObjetos(response.data);
            } catch (error) {
                console.error('Erro ao carregar estados:', error);
            }
        };

        fetchData();
    }, [objeto, estadoService]);

    const openNew = () => {
        setObjeto(objetoNovo);
        setSubmitted(false);
        setObjetoDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setObjetoDialog(false);
    }

    const hideDeleteObjetoDialog = () => {
        setObjetoDeleteDialog(false);
    }

    const saveObjeto = async (): Promise<void> => {
        setSubmitted(true);

        try {
            let _objeto = { ...objeto };

            if (_objeto.id) {
                await updateObjeto(_objeto);
            } else {
                await insertObjeto(_objeto);
            }

            setObjetoDialog(false);
            setObjeto(objetoNovo);

            showToast('success', 'Sucesso', _objeto.id ? 'Atualização da Estado' : 'Inserção de Estado');
        } catch (error) {
            handleSaveError(error);
        }
    };

    const updateObjeto = async (_objeto: Estado): Promise<void> => {
        await estadoService.alterarEstado(_objeto);
        updateObjetoInList(_objeto);
    };

    const insertObjeto = async (_objeto: Estado): Promise<void> => {
        const response = await estadoService.inserirEstado(_objeto);
        setObjetos(prevObjetos => [...prevObjetos, response.data]);
    };

    const updateObjetoInList = (_objeto: Estado): void => {
        setObjetos(prevObjetos => {
            const index = prevObjetos.findIndex(obj => obj.id === _objeto.id);
            if (index !== -1) {
                const newObjects = [...prevObjetos];
                newObjects[index] = _objeto;
                return newObjects;
            } else {
                return [...prevObjetos, _objeto];
            }
        });
    };

    const handleSaveError = (error: any): void => {
        console.error('Erro ao salvar cidade:', error);
        showToast('error', 'Erro', 'Falha ao salvar cidade. Por favor, tente novamente mais tarde.');
    };

    type ToastSeverity = "success" | "info" | "warn" | "error";

    const showToast = (severity: ToastSeverity, summary: string, detail: string): void => {
        if (toast.current) {
            toast.current.show({ severity, summary, detail, life: 3000 });
        }
    };

    const editObjeto = (objeto: Estado) => {
        setObjeto({ ...objeto });
        setObjetoDialog(true);
    }

    const confirmDeleteObjeto = (objeto: Estado) => {
        setSelectedEstados([]);
        setObjeto(objeto);
        setObjetoDeleteDialog(true);
    }

    const deleteObjeto = async () => {
        try {
            await estadoService.excluirEstado(objeto.id);
            if (toast.current) {
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Removido', life: 3000});
            }
            setObjetos(prevObjetos => prevObjetos.filter(obj => obj.id !== objeto.id));
            setObjetoDeleteDialog(false);
        } catch (error) {
            console.error('Erro ao excluir estado:', error);
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao excluir estado. Por favor, tente novamente mais tarde.', life: 3000 });
            }
        }
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = e.currentTarget.value;
        let _objeto = { ...objeto };
        _objeto[name] = val;
        setObjeto(_objeto);
    };

    const leftToolbarTemplate = () => {
        const deleteSelectedObjetos = () => {
            if (selectedEstados && selectedEstados.length > 0) {
                confirmDeleteObjeto(selectedEstados[0]);
            }
        };

        return (
            <div className="my-2">
                <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={deleteSelectedObjetos} disabled={!objetos || !objetos.length} />
            </div>
        );
    };

    const idBodyTemplate = (rowData: Estado) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    }

    const nomeBodyTemplate = (rowData: Estado) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.nome}
            </>
        );
    }

    const siglaBodyTemplate = (rowData: Estado) => {
        return (
            <>
                <span className="p-column-title">Sigla</span>
                {rowData.sigla}
            </>
        );
    }

    const actionBodyTemplate = (rowData: Estado) => {
        return (
            <div>
                <Button icon="pi pi-pencil" className="mr-2" onClick={() => editObjeto(rowData)} />
                <Button icon="pi pi-trash" onClick={() => confirmDeleteObjeto(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciar Estados</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Pesquisar..." />
            </span>
        </div>
    );

    const objetoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" onClick={saveObjeto} />
        </>
    );

    const deleteObjetoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" onClick={hideDeleteObjetoDialog} />
            <Button label="Sim" icon="pi pi-check" onClick={deleteObjeto} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={objetos}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last}. Total de {totalRecords} Estados"
                        selectionMode="multiple"
                        selection={selectedEstados}
                        onSelectionChange={(e) => setSelectedEstados(e.value)}
                        globalFilter={globalFilter}
                        emptyMessage="Sem estados cadastradas."
                        header={header}
                        filters={{ 'global': { value: globalFilter, matchMode: 'contains' } }}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Id" body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nome" header="Nome" body={nomeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="sigla" header="Sigla" body={siglaBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={objetoDialog} style={{ width: '450px' }} header="Cadastrar" modal className="p-fluid" footer={objetoDialogFooter} onHide={hideDialog}>

                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText
                                id="nome"
                                value={objeto.nome}
                                onChange={(e) => onInputChange(e, 'nome')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !objeto.nome
                                })}
                            />
                            {submitted && !objeto.nome && <small className="p-invalid">O nome é obrigatório!</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="sigla">Sigla</label>
                            <InputText
                                id="sigla"
                                value={objeto.sigla}
                                onChange={(e) => onInputChange(e, 'sigla')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !objeto.sigla
                                })}
                            />
                            {submitted && !objeto.sigla && <small className="p-invalid">Sigla é obrigatória!</small>}
                        </div>

                    </Dialog>

                    <Dialog visible={objetoDeleteDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteObjetoDialogFooter} onHide={hideDeleteObjetoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {objeto && (
                                <span>
                                    Deseja excluir <b>{objeto.nome}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Estados;


