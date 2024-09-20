import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material Modules
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatStepperModule } from '@angular/material/stepper';
import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTreeModule } from '@angular/material/tree';
import { ToastrModule } from "ngx-toastr";
import { MatPaginator } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [
        //Common Modules
        MatPaginator,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSidenavModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatMenuModule,
        MatDividerModule,
        MatTooltipModule,
        MatSortModule,
        MatSelectModule,
        MatTableModule,
        MatTabsModule,
        MatChipsModule,
        MatExpansionModule,
        MatSlideToggleModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatDialogModule,
        MatCardModule,
        MatListModule,
        MatProgressBarModule,
        MatRadioModule,
        MatAutocompleteModule,
        MatStepperModule,
        ClipboardModule,
        MatToolbarModule,
        A11yModule,
        DragDropModule,
        PortalModule,
        ScrollingModule,
        CdkStepperModule,
        CdkTableModule,
        CdkTreeModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatGridListModule,
        MatSliderModule,
        MatSnackBarModule,
        MatTreeModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 5000,
            positionClass: "toast-top-right",
            preventDuplicates: true,
            maxOpened: 5,
            // autoDismiss: false,
            // closeButton: true
        }),
    ],
    declarations: [

    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSidenavModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatCheckboxModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatMenuModule,
        MatDividerModule,
        MatTooltipModule,
        MatSortModule,
        MatSelectModule,
        MatTableModule,
        MatTabsModule,
        MatStepperModule,
        MatChipsModule,
        MatExpansionModule,
        MatSlideToggleModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatDialogModule,
        MatCardModule,
        MatListModule,
        MatProgressBarModule,
        MatRadioModule,
        MatAutocompleteModule,
        ClipboardModule,
        MatToolbarModule,
        A11yModule,
        DragDropModule,
        PortalModule,
        ScrollingModule,
        CdkStepperModule,
        CdkTableModule,
        CdkTreeModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatGridListModule,
        MatSliderModule,
        MatSnackBarModule,
        MatTreeModule,
        ToastrModule,
        BrowserAnimationsModule
    ],
    providers: [],
})
export class SharedModule {}
