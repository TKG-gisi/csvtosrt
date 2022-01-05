function tabUi(){
    this.tabIds = [];
    this.addTab = function(id) {
        this.tabIds.push(id);
    }
    this.tabLookup = function (id) {
        let result= -1 ;
        let i=0;
        for(i=0;i<this.tabIds.length;i++){
            if (this.tabIds[i] === id) {result=i; break;}
        }
        if (this.tabIds[i] !== id) {result=-1;}
        return result;
    }
    this.removeTab = function (id) {
        let result = this.tabLookup(id);
        if (result == -1){
            console.error("tab \""+id+"\" not found.");
        }else{
            this.tabIds.splice(result);
        }
    }
    this.hideTab = function(id){
        document.getElementById(id).classList.add("tab_window_hide");
        let tabElementId="tab_"+id;
        document.getElementById(tabElementId).classList.remove("tab_show");
        document.getElementById(tabElementId).classList.add("tab_hide");
    }
    this.showTab = function(id){
        document.getElementById(id).classList.remove("tab_window_hide");
        let tabElementId="tab_"+id;
        document.getElementById(tabElementId).classList.remove("tab_hide");
        document.getElementById(tabElementId).classList.add("tab_show");
    }
    this.switchTab = function(id){

        let i = this.tabLookup(id);
        this.tabIds.forEach(element => this.hideTab(element));
        this.showTab(id);
    }
    return this;
}


/* ---- custom for CSVtoSRT ---- */
var tabs;
window.addEventListener('load',()=>{
    tabs = new tabUi();
    tabs.addTab("about");
    tabs.addTab("import");
    tabs.addTab("export");
    tabs.addTab("edit");
    tabs.switchTab("about");
})
