from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = 'add_upload_and_lit_state'
down_revision = '3f755bcf4863'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table('upload_jobs',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('error', sa.String(), nullable=True),
        sa.Column('paper_id', sa.Integer(), nullable=True),
        sa.Column('structure', sa.JSON(), nullable=True),
        sa.ForeignKeyConstraint(['paper_id'], ['papers.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.add_column('research_conversations', sa.Column('literature_state', sa.JSON(), nullable=True))

def downgrade() -> None:
    op.drop_column('research_conversations', 'literature_state')
    op.drop_table('upload_jobs')
