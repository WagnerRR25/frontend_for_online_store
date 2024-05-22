
'use client'


import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { classNames } from "primereact/utils";
import { PessoaService } from "@/demo/service/cadastro/PessoaService";
import { PermissaoPessoa } from "@/types/permissaopessoa";
import { Pessoa } from "@/types";

const PermissãoPessoa = () => {
    const objetoNovo: Pessoa = {
        id: null,
        nomeCompleto: '',
        cpf: '',
        email: '',
        endereco: '',
        cep: '',
        PermissaoPessoa: []
    };

    const [objeto, setObjeto] = useState<PermissaoPessoa>(objetoNovo);
    const [objetos, setObjetos] = useState<PermissaoPessoa[]>([]);
    const [selectedPessoas, setSelectedPessoas] = useState<Pessoa[]>([]);
    const [PermissaoPessoa, setPermissaoPessoa] = useState<PermissaoPessoa[]>([]);
    const [objetoDialog, setObjetoDialog] = useState(false);
    const [objetoDeleteDialog, setObjetoDeleteDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Pessoa>>(null);
    const pessoaService = useMemo(() => new PessoaService(), []);
    const permissaoPessoaService = useMemo(() => new permissaoPessoaService(), []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await pessoaService.buscarTodos();
                setObjetos(response.data);
            } catch (error) {
                handleFetchError('Erro ao carregar pessoas:', error);
            }

            try {
                const response = await permissaoPessoaService.buscarTodos();
                setPermissaoPessoa(response.data);
            } catch (error) {
                handleFetchError('Erro ao carregar permissões:', error);
            }
        };

        fetchData();
    }, [pessoaService, permissaoPessoaService]);

    const handleFetchError = (message: string, error: any) => {
        console.error(message, error);
        if (toast.current) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: `Falha ao carregar: ${message}. Por favor, tente novamente mais tarde.`, life: 3000 });
        }
    };

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
        } catch (error) {
            handleSaveError(error);
        }
    };

    const updateObjeto = async (_objeto: Pessoa): Promise<void> => {
        await pessoaService.alterarPessoa(_objeto);
        showToast('success', 'Sucesso', 'Atualização da Pessoa');
        updateObjetoInList(_objeto);
    };

    const insertObjeto = async (_objeto: Pessoa): Promise<void> => {
        const response = await pessoaService.inserirPessoa(_objeto);
        _objeto.id = response.data.id;
        showToast('success', 'Sucesso', 'Inserção de Pessoa');
        setObjetos(prevObjetos => [...prevObjetos, _objeto]);
    };

    const updateObjetoInList = (_objeto: Pessoa): void => {
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
        console.error('Erro ao salvar pessoa:', error);
        showToast('error', 'Erro', 'Falha ao salvar pessoa. Por favor, tente novamente mais tarde.');
    };

    const showToast = (severity: "success" | "info" | "warn" | "error", summary: string, detail: string): void => {
        if (toast.current) {
            toast.current.show({ severity, summary, detail, life: 3000 });
        }
    };

    const editObjeto = (objeto: Pessoa) => {
        setObjeto({ ...objeto });
        setObjetoDialog(true);
    }

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteObjeto = (objeto: Pessoa) => {
        setSelectedPessoas([]);
        setObjeto(objeto);
        setObjetoDeleteDialog(true);
    }

    const deleteObjeto = async () => {
        if (objeto.id !== null) {
            try {
                await pessoaService.excluirPessoa(objeto.id.toString());
                showToast('success', 'Sucesso', 'Removido');
                setObjetos(prevObjetos => prevObjetos.filter(obj => obj.id !== objeto.id));
                setObjetoDeleteDialog(false);
            } catch (error) {
                console.error('Erro ao excluir pessoa:', error);
                showToast('error', 'Erro', 'Falha ao excluir pessoa. Por favor, tente novamente mais tarde.');
            }
        }
    }

    const onInputChange = (e: ChangeEvent<HTMLInputElement>, name: keyof Pessoa) => {
        const val = e.target.value || '';
        setObjeto({ ...objeto, [name]: val });
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="my-2">
                <Button label="Novo" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={deleteSelectedObjetos} disabled={!selectedPessoas.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
        );
    };

    const idBodyTemplate = (rowData: Pessoa) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id !== null ? rowData.id.toString() : ''}
            </>
        );
    }

    const nomeBodyTemplate = (rowData: Pessoa) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.nomeCompleto}
            </>
        );
    }

    const cpfBodyTemplate = (rowData: Pessoa) => {
        return (
            <>
                <span className="p-column-title">CPF</span>
                {rowData.cpf}
            </>
        );
    }

    const emailBodyTemplate = (rowData: Pessoa) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    }

    const enderecoBodyTemplate = (rowData: Pessoa) => {
        return (
            <>
                <span className="p-column-title">Endereço</span>
                {rowData.endereco}
            </>
        );
    }

    const cepBodyTemplate = (rowData: Pessoa) => {
        return (
            <>
                <span className="p-column-title">CEP</span>
                {rowData.cep}
            </>
        );
    }

    const permissoesBodyTemplate = (rowData: Pessoa) => {
        return (
            <>
                <span className="p-column-title">Permissões</span>
                {rowData.permissoes?.map((permissaoPessoa: { nome: any; }) => permissaoPessoa.nome).join(', ')}
            </>
        );
    }

    const actionBodyTemplate = (rowData: Pessoa) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" severity="success" rounded className="mr-2" onClick={() => editObjeto(rowData)} />
                <Button icon="pi pi-trash" severity="danger" rounded onClick={() => confirmDeleteObjeto(rowData)} />
            </div>
        );
    }

    const deleteSelectedObjetos = () => {
        setObjetoDeleteDialog(true);
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Pessoas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e: ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const objetoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" onClick={saveObjeto} />
        </>
    );

    const deleteObjetoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" outlined onClick={hideDeleteObjetoDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deleteObjeto} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <DataTable ref={dt} value={objetos} selection={selectedPessoas} onSelectionChange={(e) => setSelectedPessoas(e.value as Pessoa[])}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column field="id" header="Id" body={idBodyTemplate} sortable></Column>
                        <Column field="nomeCompleto" header="Nome" body={nomeBodyTemplate} sortable></Column>
                        <Column field="cpf" header="CPF" body={cpfBodyTemplate} sortable></Column>
                        <Column field="email" header="Email" body={emailBodyTemplate} sortable></Column>
                        <Column field="endereco" header="Endereço" body={enderecoBodyTemplate} sortable></Column>
                        <Column field="cep" header="CEP" body={cepBodyTemplate} sortable></Column>
                        <Column field="permissoes" header="Permissões" body={permissoesBodyTemplate} sortable></Column>
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                    </DataTable>

                    <Dialog visible={objetoDialog} style={{ width: '450px' }} header="Detalhes da Pessoa" modal className="p-fluid" footer={objetoDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nomeCompleto">Nome Completo</label>
                            <InputText id="nomeCompleto" value={objeto.nomeCompleto} onChange={(e) => onInputChange(e, 'nomeCompleto')} required autoFocus className={classNames({ 'p-invalid': submitted && !objeto.nomeCompleto })} />
                            {submitted && !objeto.nomeCompleto && <small className="p-error">Nome é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="cpf">CPF</label>
                            <InputText id="cpf" value={objeto.cpf} onChange={(e) => onInputChange(e, 'cpf')} required className={classNames({ 'p-invalid': submitted && !objeto.cpf })} />
                            {submitted && !objeto.cpf && <small className="p-error">CPF é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={objeto.email} onChange={(e) => onInputChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !objeto.email })} />
                            {submitted && !objeto.email && <small className="p-error">Email é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="endereco">Endereço</label>
                            <InputText id="endereco" value={objeto.endereco} onChange={(e) => onInputChange(e, 'endereco')} required className={classNames({ 'p-invalid': submitted && !objeto.endereco })} />
                            {submitted && !objeto.endereco && <small className="p-error">Endereço é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="cep">CEP</label>
                            <InputText id="cep" value={objeto.cep} onChange={(e) => onInputChange(e, 'cep')} required className={classNames({ 'p-invalid': submitted && !objeto.cep })} />
                            {submitted && !objeto.cep && <small className="p-error">CEP é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="permissoes">Permissões</label>
                            <MultiSelect id="permissoes" value={objeto.permissoes} options={permissoes} onChange={(e) => setObjeto({ ...objeto, permissoes: e.value })} optionLabel="nome" placeholder="Selecione permissões" display="chip" className={classNames({ 'p-invalid': submitted && (!objeto.permissoes || !objeto.permissoes.length) })} />
                            {submitted && (!objeto.permissoes || !objeto.permissoes.length) && <small className="p-error">Permissões são obrigatórias.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={objetoDeleteDialog} style={{ width: '450px' }} header="Confirmação" modal footer={deleteObjetoDialogFooter} onHide={hideDeleteObjetoDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {objeto && <span>Tem certeza que deseja deletar <b>{objeto.nomeCompleto}</b>?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default PermissãoPessoa;
