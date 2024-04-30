'use client';

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { EstadoService } from "@/demo/service/cadastros/EstadoService";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import { Cidade, Estado } from "@/types";
import { CidadeService } from "@/demo/service/cadastros/CidadeService";
import { DataTable } from "primereact/datatable";

const Cadastros = () => {
    const objetoNovo: Estado = {
        id: '',
        nome: '',
        sigla: '',
        inventoryStatus: 'INSTOCK'
    };

    const objetoNovoCidade: Cidade = {
        id: '',
        nome: '',
        inventoryStatus: 'INSTOCK'
    };

    const [estados, setEstados] = useState<Estado[]>([]);
    const [cidades, setCidades] = useState<Cidade[]>([]);
    const [objetoDialogEstado, setObjetoDialogEstado] = useState(false);
    const [objetoDialogCidade, setObjetoDialogCidade] = useState(false);
    const [objetoDeleteDialogEstado, setObjetoDeleteDialogEstado] = useState(false);
    const [objetoDeleteDialogCidade, setObjetoDeleteDialogCidade] = useState(false);
    const dtEstado = useRef<DataTable>(null);
    const dtCidade = useRef<DataTable>(null);
    const toast = useRef<Toast>(null);
    const [objeto, setObjeto] = useState<Estado>(objetoNovo);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');

    // UseEffect para carregar estados
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await EstadoService.buscarTodos();
                setObjeto(response.data);
            } catch (error) {
                console.error('Erro ao carregar estados:', error);
                if (toast.current) {
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar estados. Por favor, tente novamente mais tarde.', life: 3000 });
                }
            }
        };
        fetchData();
    }, [objetoDialogCidade]);

    // UseEffect para carregar cidades quando o dialog de estado é aberto
    useEffect(() => {
        const fetchData = async () => {
            if (objetoDialogEstado) {
                try {
                    const response = await CidadeService.buscarTodos();
                    setCidades(response.data);
                } catch (error) {
                    console.error(error);
                    if (toast.current) {
                        toast.current.show({ severity: 'info', summary: 'Erro!', detail: 'Erro ao carregar a lista de Estados', life: 3000 });
                    }
                }
            }
        };
        fetchData();
    }, [objetoDialogEstado, CidadeService]);

    // Função para abrir o dialog de estado
    const openNewEstado = () => {
        setObjeto(objetoNovo);
        setSubmitted(false);
        setObjetoDialogEstado(true);
    };

    // Função para abrir o dialog de cidade
    const openNewCidade = () => {
        setObjeto(objetoNovo);
        setSubmitted(false);
        setObjetoDialogCidade(true);
    };

    // Função para fechar o dialog de estado
    const hideDialogEstado = () => {
        setSubmitted(false);
        setObjetoDialogEstado(false);
    };

    // Função para fechar o dialog de cidade
    const hideDialogCidade = () => {
        setSubmitted(false);
        setObjetoDialogCidade(false);
    };

    // Função para fechar o dialog de exclusão de estado
    const hideDeleteObjetoDialogEstado = () => {
        setObjetoDeleteDialogEstado(false);
    };

    // Função para fechar o dialog de exclusão de cidade
    const hideDeleteObjetoDialogCidade = () => {
        setObjetoDeleteDialogCidade(false);
    };

    // Função para salvar estado
    const saveObjetoEstado = async () => {
        setSubmitted(true);
        if (objeto.nome.trim() && objeto.sigla.trim()) {
            try {
                let _objeto = { ...objeto };
                if (objeto.id) {
                    await EstadoService.alterar(_objeto);
                    if (toast.current) {
                        toast.current.show({severity: 'success', summary: 'Sucesso', detail: 'Atualização do Estado', life: 3000});
                    }
                } else {
                    await EstadoService.inserirEstado(_objeto);
                    if (toast.current) {
                        toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Inserção de Estado', life: 3000});
                    }
                }
                setEstados([...estados, _objeto]); // Atualiza estados imutavelmente
                setObjeto(objetoNovo);
                setObjetoDialogEstado(false);
            } catch (error) {
                console.error('Erro ao salvar estado:', error);
                if (toast.current) {
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar estado. Por favor, tente novamente mais tarde.', life: 3000 });
                }
            }
        }
    };

    // Função para salvar cidade
    const saveObjetoCidade = async () => {
        setSubmitted(true);
        if (objeto.nome.trim() && objeto.sigla.trim()) {
            try {
                let _objeto = { ...objeto };
                if (objeto.id) {
                    await CidadeService.alterarCidade(_objeto);
                    if (toast.current) {
                        toast.current.show({severity: 'success', summary: 'Sucesso', detail: 'Atualização da Cidade', life: 3000});
                    }
                } else {
                    await CidadeService.inserirCidade(_objeto);
                    if (toast.current) {
                        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Inserção de Cidade', life: 3000});
                    }
                }
                setCidades([...cidades, _objeto]); // Atualiza cidades imutavelmente
                setObjeto(objetoNovo);
                setObjetoDialogCidade(false);
            } catch (error) {
                console.error('Erro ao salvar cidade:', error);
                if (toast.current) {
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar cidade. Por favor, tente novamente mais tarde.', life: 3000 });
                }
            }
        }
    };

    // Função para confirmar exclusão de estado
    const confirmDeleteObjetoEstado = (objeto: Estado) => {
        setObjeto(objeto);
        setObjetoDeleteDialogEstado(true);
    };

    // Função para confirmar exclusão de cidade
    const confirmDeleteObjetoCidade = (objeto: Cidade) => {
        setObjeto(objeto);
        setObjetoDeleteDialogCidade(true);
    };

    // Função para excluir estado
    const deleteObjetoEstado = async () => {
        try {
            await EstadoService.excluirEstado(objeto.id);
            if (toast.current) {
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Removido', life: 3000});
            }
            setEstados(estados.filter(e => e.id !== objeto.id)); // Atualiza estados imutavelmente
            setObjetoDeleteDialogEstado(false);
        } catch (error) {
            console.error('Erro ao excluir estado:', error);
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao excluir estado. Por favor, tente novamente mais tarde.', life: 3000 });
            }
        }
    };

    // Função para excluir cidade
    const deleteObjetoCidade = async () => {
        try {
            await CidadeService.excluirCidade(objeto.id);
            if (toast.current) {
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Removido', life: 3000 });
            }
            setCidades(cidades.filter(c => c.id !== objeto.id)); // Atualiza cidades imutavelmente
            setObjetoDeleteDialogCidade(false);
        } catch (error) {
            console.error('Erro ao excluir cidade:', error);
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao excluir cidade. Por favor, tente novamente mais tarde.', life: 3000 });
            }
        }
    };


    // Função para lidar com eventos de mudança nos campos de entrada
    const onInputChange = (e: ChangeEvent<HTMLInputElement>, name: string) => {
        const val = e.currentTarget.value;
        let _objeto = { ...objeto };
        _objeto[name as keyof Estado] = val;
        setObjeto(_objeto);
    };

    const leftToolbarTemplateEstado = () => {
        return (
            <div className="my-2">
                <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNewEstado} />
                <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteObjetoEstado} disabled={!objeto || !objeto.id} />
            </div>
        );
    };

    const leftToolbarTemplateCidade = () => {
        return (
            <div className="my-2">
                <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNewCidade} />
                <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteObjetoCidade} disabled={!objeto || !objeto.id} />
            </div>
        );
    };

    const idBodyTemplateEstado = (rowData: Estado) => {
        return rowData.id;
    };

    const idBodyTemplateCidade = (rowData: Cidade) => {
        return rowData.id;
    };

    const headerEstado = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Estados</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const headerCidade = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Cidades</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const objetoDialogFooterEstado = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialogEstado} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveObjetoEstado} />
        </>
    );

    const objetoDialogFooterCidade = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialogCidade} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveObjetoCidade} />
        </>
    );

    const deleteObjetoDialogFooterEstado = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteObjetoDialogEstado} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteObjetoEstado} />
        </>
    );

    const deleteObjetoDialogFooterCidade = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteObjetoDialogCidade} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteObjetoCidade} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-6">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplateEstado}></Toolbar>

                    <DataTable<Estado>
                        ref={dtEstado}
                        value={objeto}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last}. Total de {totalRecords} objetos"
                        globalFilter={globalFilter}
                        emptyMessage="Sem objetos cadastrados."
                        header={headerEstado}
                    >
                        <Column field="id" header="Id" sortable body={idBodyTemplateEstado} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nome" header="Nome" sortable body={idBodyTemplateEstado} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="sigla" header="Sigla" sortable body={idBodyTemplateEstado} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={idBodyTemplateEstado} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={objetoDialogCidade} style={{ width: '450px' }} header="Cadastrar" modal className="p-fluid" footer={objetoDialogFooterEstado} onHide={hideDialogEstado}>
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
                            {submitted && !objeto.sigla && <small className="p-invalid"> Sigla obrigatório!</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={objetoDeleteDialogCidade} style={{ width: '450px' }} header="Confirm" modal footer={deleteObjetoDialogFooterEstado} onHide={hideDeleteObjetoDialogEstado}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {objeto && (
                                <span>
                                    Deseja Excluir <b>{objeto.nome}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
            <div className="col-6">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplateCidade}></Toolbar>

                    <DataTable<Cidade>
                        ref={dtCidade}
                        value={cidades}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last}. Total de {totalRecords} Cidades"
                        globalFilter={globalFilter}
                        emptyMessage="Sem objetos cadastrados."
                        header={headerCidade}
                    >
                        <Column field="id" header="Id" sortable body={idBodyTemplateCidade} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nome" header="Nome" sortable body={idBodyTemplateCidade} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="sigla" header="Sigla" sortable body={idBodyTemplateCidade} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={idBodyTemplateCidade} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={objetoDeleteDialogEstado} style={{ width: '450px' }} header="Confirm" modal footer={deleteObjetoDialogFooterCidade} onHide={hideDeleteObjetoDialogCidade}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {objeto && (
                                <span>
                                    Deseja Excluir <b>{objeto.nome}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default Cadastros;

